// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./interfaces/ILoanCore.sol";
import "./interfaces/ICallDelegator.sol";

import "./libraries/InterestCalculator.sol";
import "./vault/OwnableERC721.sol";
import "./libraries/FacilitatorLib.sol";

contract LoanCore is
    ILoanCore,
    InterestCalculator,
    AccessControlEnumerable,
    Pausable,
    ReentrancyGuard,
    ICallDelegator
{
    using SafeERC20 for IERC20;

    // ============================================ STATE ==============================================

    // =================== Constants =====================

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant ORIGINATOR_ROLE = keccak256("ORIGINATOR");
    bytes32 public constant REPAYER_ROLE = keccak256("REPAYER");
    bytes32 public constant AFFILIATE_MANAGER_ROLE =
        keccak256("AFFILIATE_MANAGER");
    bytes32 public constant FEE_CLAIMER_ROLE = keccak256("FEE_CLAIMER");
    bytes32 public constant SHUTDOWN_ROLE = keccak256("SHUTDOWN");

    IERC20 public USDC;
    IERC20 public GHO;

    /// @dev Max split any affiliate can earn.
    uint96 private constant MAX_AFFILIATE_SPLIT = 50_00;

    /// @dev Grace period for repaying a loan after loan duration.
    uint256 public constant GRACE_PERIOD = 10 minutes;

    // =================== Loan State =====================

    uint256 private loanIdTracker;
    mapping(uint256 => LoanLibrary.LoanData) private loans;
    mapping(address => mapping(uint160 => bool)) public usedNonces;

    // ========================================== CONSTRUCTOR ===========================================

    constructor(address usdc, address gho) {
        USDC = IERC20(usdc);
        GHO = IERC20(gho);
        _setupRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(ORIGINATOR_ROLE, ADMIN_ROLE);
        _setRoleAdmin(REPAYER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(FEE_CLAIMER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(AFFILIATE_MANAGER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(SHUTDOWN_ROLE, ADMIN_ROLE);
    }

    // ====================================== LIFECYCLE OPERATIONS ======================================

    function startLoan(
        address lender,
        address borrower,
        LoanLibrary.LoanTerms calldata terms,
        LoanLibrary.FeeSnapshot calldata _feeSnapshot
    )
        external
        override
        whenNotPaused
        onlyWHitelistedNFT(terms.collateralAddress)
        onlyWHitelistedDestination(terms.destinationChain)
        onlyRole(ORIGINATOR_ROLE)
        nonReentrant
        returns (uint256 loanId)
    {
        uint256 floorPriceUSD = Chainlink.getPrice(terms.collectionId);
        uint256 maxBorrowable = calculateCollateralValue(floorPriceUSD);

        if (terms.principal > maxBorrowable)
            revert Exceeds_Maximum_Borrowable();

        loadId = loanIdTracker;

        unchecked {
            loanIdTracker++;
        }

        // Initiate loan state
        loans[loanId] = LoanLibrary.LoanData({
            state: LoanLibrary.LoanState.Active,
            startDate: uint64(block.timestamp),
            lastAccrualTimestamp: uint64(block.timestamp),
            terms: terms,
            balance: terms.principal,
            interestAmountPaid: 0
        });

        if (terms.facilitator == Native) {
            handleNative();
        } else {
            // create the approval to aave pool
            USDC.approve(address(FacilitatorLib.aaveV3Pool), terms.principal);

            // supply the asset to Aave
            FacilitatorLib.supplyUSDC(address(USDC), maxBorrowable, treasury);

            // Borrow GHO
            FacilitatorLib.borrowGHO(address(GHO), maxBorrowable, treasury);
        }
    }

    /**
     * @notice Repay the given loan. Can only be called by RepaymentController,
     *         which verifies repayment conditions. This method will collect
     *         the total interest due from the borrower  and redistribute
     *         principal + interest to the lender, and collateral to the borrower.
     *         All promissory notes will be burned and the loan will be marked as complete.
     *
     * @param loanId                The ID of the loan to repay.
     * @param payer                 The party repaying the loan.
     * @param _amountToLender       The amount of tokens to be distributed to the lender (net after fees).
     * @param _interestAmount       The interest amount to be paid.
     * @param _paymentToPrincipal   The portion of the repayment amount that goes to principal.
     */
    function repay(
        uint256 loanId,
        address payer,
        uint256 _amountToLender,
        uint256 _interestAmount,
        uint256 _paymentToPrincipal
    ) external override onlyRole(REPAYER_ROLE) nonReentrant {
        (
            LoanLibrary.LoanData memory data,
            uint256 amountFromPayer
        ) = _handleRepay(
                loanId,
                _amountToLender,
                _interestAmount,
                _paymentToPrincipal
            );

        // get promissory notes from two parties involved
        address lender = lenderNote.ownerOf(loanId);
        address borrower = borrowerNote.ownerOf(loanId);

        // collect principal and interest from borrower
        _collectIfNonzero(
            IERC20(data.terms.payableCurrency),
            payer,
            amountFromPayer
        );
        // send repayment less fees to lender
        _transferIfNonzero(
            IERC20(data.terms.payableCurrency),
            lender,
            _amountToLender
        );

        if (loans[loanId].state == LoanLibrary.LoanState.Repaid) {
            // if loan is completely repaid
            // burn both notes
            _burnLoanNotes(loanId);
            // redistribute collateral and emit event
            IERC721(data.terms.collateralAddress).safeTransferFrom(
                address(this),
                borrower,
                data.terms.collateralId
            );

            emit LoanRepaid(loanId);
        }

        emit LoanPayment(loanId);
    }

    /**
     * @notice Claim collateral on a given loan. Can only be called by RepaymentController,
     *         which verifies claim conditions. This method validates that the loan's due
     *         date has passed, and the grace period of 10 mins has also passed. Then it distributes
     *         collateral to the lender. All promissory notes will be burned and the loan
     *         will be marked as complete.
     *
     * @dev If LoanCore is holding a withdrawal balance for this loan's NoteReceipt. The collateral
     *      cannot be claimed until the available balance is withdrawn.
     *
     * @param loanId                              The ID of the loan to claim.
     * @param _amountFromLender                   Any claiming fees to be collected from the lender.
     */
    function claim(
        uint256 loanId,
        uint256 _amountFromLender
    ) external override whenNotPaused onlyRole(REPAYER_ROLE) nonReentrant {
        LoanLibrary.LoanData memory data = loans[loanId];
        // Ensure valid initial loan state when claiming loan
        if (data.state != LoanLibrary.LoanState.Active)
            revert LC_InvalidState(data.state);

        // Check that loan has a noteReceipt of zero amount
        if (noteReceipts[loanId].amount != 0)
            revert LC_AwaitingWithdrawal(noteReceipts[loanId].amount);

        // First check if the call is being made after the due date plus 10 min grace period.
        uint256 dueDate = data.startDate +
            data.terms.durationSecs +
            GRACE_PERIOD;
        if (dueDate >= block.timestamp) revert LC_NotExpired(dueDate);

        // State changes and cleanup
        loans[loanId].state = LoanLibrary.LoanState.Defaulted;
        collateralInUse[
            keccak256(
                abi.encode(
                    data.terms.collateralAddress,
                    data.terms.collateralId
                )
            )
        ] = false;

        if (_amountFromLender > 0) {
            // Assign fees for withdrawal
            (
                uint256 protocolFee,
                uint256 affiliateFee,
                address affiliate
            ) = _getAffiliateSplit(_amountFromLender, data.terms.affiliateCode);

            mapping(address => uint256)
                storage _feesWithdrawable = feesWithdrawable[
                    data.terms.payableCurrency
                ];
            if (protocolFee > 0)
                _feesWithdrawable[address(this)] += protocolFee;
            if (affiliateFee > 0) _feesWithdrawable[affiliate] += affiliateFee;
        }

        // Get owner of the LenderNote
        address lender = lenderNote.ownerOf(loanId);
        // Burn both notes
        _burnLoanNotes(loanId);

        // Collateral redistribution
        IERC721(data.terms.collateralAddress).safeTransferFrom(
            address(this),
            lender,
            data.terms.collateralId
        );

        // Collect claim fee from lender
        _collectIfNonzero(
            IERC20(data.terms.payableCurrency),
            lender,
            _amountFromLender
        );

        emit LoanClaimed(loanId);
    }

    /**
     * @notice Roll over a loan, atomically closing one and re-opening a new one with the
     *         same collateral. Instead of full repayment, only net payments from each
     *         party are required. Each rolled-over loan is marked as complete, and the new
     *         loan is given a new unique ID and notes. At the time of calling, any needed
     *         net payments have been collected by the RepaymentController for withdrawal.
     *
     * @param oldLoanId             The ID of the old loan.
     * @param oldLender             The lender for the old loan.
     * @param borrower              The borrower for the loan.
     * @param lender                The lender for the old loan.
     * @param terms                 The terms of the new loan.
     * @param _settledAmount        The amount LoanCore needs to withdraw to settle.
     * @param _amountToOldLender    The payment to the old lender (if lenders are changing).
     * @param _amountToLender       The payment to the lender (if same as old lender).
     * @param _amountToBorrower     The payment to the borrower (in the case of leftover principal).
     * @param _interestAmount       The interest amount to be paid.
     *
     * @return newLoanId            The ID of the new loan.
     */
    function rollover(
        uint256 oldLoanId,
        address oldLender,
        address borrower,
        address lender,
        LoanLibrary.LoanTerms calldata terms,
        uint256 _settledAmount,
        uint256 _amountToOldLender,
        uint256 _amountToLender,
        uint256 _amountToBorrower,
        uint256 _interestAmount
    )
        external
        override
        whenNotPaused
        onlyRole(ORIGINATOR_ROLE)
        nonReentrant
        returns (uint256 newLoanId)
    {
        LoanLibrary.LoanData storage data = loans[oldLoanId];
        // Ensure valid loan state for old loan
        if (data.state != LoanLibrary.LoanState.Active)
            revert LC_InvalidState(data.state);

        // State change for old loan
        data.state = LoanLibrary.LoanState.Repaid;
        data.balance = 0;
        data.interestAmountPaid += _interestAmount;

        IERC20 payableCurrency = IERC20(data.terms.payableCurrency);

        // Check that contract will not net lose tokens
        if (
            _amountToOldLender + _amountToLender + _amountToBorrower >
            _settledAmount
        )
            revert LC_CannotSettle(
                _amountToOldLender + _amountToLender + _amountToBorrower,
                _settledAmount
            );
        {
            // Assign fees for withdrawal
            uint256 feesEarned;
            unchecked {
                feesEarned =
                    _settledAmount -
                    _amountToOldLender -
                    _amountToLender -
                    _amountToBorrower;
            }

            // Make sure split goes to affiliate code from _new_ terms
            (
                uint256 protocolFee,
                uint256 affiliateFee,
                address affiliate
            ) = _getAffiliateSplit(feesEarned, terms.affiliateCode);

            // Assign fees for withdrawal
            mapping(address => uint256)
                storage _feesWithdrawable = feesWithdrawable[
                    address(payableCurrency)
                ];
            if (protocolFee > 0)
                _feesWithdrawable[address(this)] += protocolFee;
            if (affiliateFee > 0) _feesWithdrawable[affiliate] += affiliateFee;
        }

        // Set up new loan
        newLoanId = loanIdTracker.current();
        loanIdTracker.increment();

        loans[newLoanId] = LoanLibrary.LoanData({
            state: LoanLibrary.LoanState.Active,
            startDate: uint64(block.timestamp),
            lastAccrualTimestamp: uint64(block.timestamp),
            terms: terms,
            feeSnapshot: data.feeSnapshot,
            balance: terms.principal,
            interestAmountPaid: 0
        });

        // Burn old notes
        _burnLoanNotes(oldLoanId);

        // Mint new notes
        _mintLoanNotes(newLoanId, borrower, lender);

        // Perform net settlement operations
        _collectIfNonzero(payableCurrency, msg.sender, _settledAmount);
        _transferIfNonzero(payableCurrency, oldLender, _amountToOldLender);
        _transferIfNonzero(payableCurrency, lender, _amountToLender);
        _transferIfNonzero(payableCurrency, borrower, _amountToBorrower);

        emit LoanRepaid(oldLoanId);
        emit LoanStarted(newLoanId, lender, borrower);
        emit LoanRolledOver(oldLoanId, newLoanId);
    }

    // ======================================== NONCE MANAGEMENT ========================================

    /**
     * @notice Mark a nonce as used in the context of starting a loan. Reverts if
     *         nonce has already been used. Can only be called by Origination Controller.
     *
     * @param user                  The user for whom to consume a nonce.
     * @param nonce                 The nonce to consume.
     */
    function consumeNonce(
        address user,
        uint160 nonce
    ) external override whenNotPaused onlyRole(ORIGINATOR_ROLE) {
        _useNonce(user, nonce);
    }

    /**
     * @notice Mark a nonce as used in order to invalidate signatures with the nonce.
     *         Does not allow specifying the user, and automatically consumes the nonce
     *         of the caller.
     *
     * @param nonce                 The nonce to consume.
     */
    function cancelNonce(uint160 nonce) external override {
        _useNonce(msg.sender, nonce);
    }

    // ========================================= VIEW FUNCTIONS =========================================

    /**
     * @notice Returns the LoanData struct for the specified loan ID.
     *
     * @param loanId                The ID of the given loan.
     *
     * @return loanData             The struct containing loan state and terms.
     */
    function getLoan(
        uint256 loanId
    ) external view override returns (LoanLibrary.LoanData memory loanData) {
        return loans[loanId];
    }

    /**
     * @notice Reports whether the given nonce has been previously used by a user. Returning
     *         false does not mean that the nonce will not clash with another potential off-chain
     *         signature that is stored somewhere.
     *
     * @param user                  The user to check the nonce for.
     * @param nonce                 The nonce to check.
     *
     * @return used                 Whether the nonce has been used.
     */
    function isNonceUsed(
        address user,
        uint160 nonce
    ) external view override returns (bool) {
        return usedNonces[user][nonce];
    }

    // ========================================= FEE MANAGEMENT =========================================

    /**
     * @notice Claim any feesWithdrawable balance pending for the caller, as specified by token.
     *         This may accumulate from either affiliate fee shares or borrower forced repayments.
     *
     * @param token                 The contract address of the token to claim tokens for.
     * @param amount                The amount of tokens to claim.
     * @param to                    The address to send the tokens to.
     */
    function withdraw(
        address token,
        uint256 amount,
        address to
    ) external override nonReentrant {
        if (token == address(0)) revert LC_ZeroAddress("token");
        if (amount == 0) revert LC_ZeroAmount();
        if (to == address(0)) revert LC_ZeroAddress("to");

        // any token balances remaining on this contract are fees owned by the protocol
        mapping(address => uint256)
            storage _feesWithdrawable = feesWithdrawable[token];

        uint256 available = _feesWithdrawable[msg.sender];
        if (amount > available) revert LC_CannotWithdraw(amount, available);

        unchecked {
            _feesWithdrawable[msg.sender] -= amount;
        }

        _transferIfNonzero(IERC20(token), to, amount);

        emit FeesWithdrawn(token, msg.sender, to, amount);
    }

    /**
     * @notice Claim the protocol fees for the given token. Any token used as principal
     *         for a loan will have accumulated fees. Must be called by contract owner.
     *
     * @param token                     The contract address of the token to claim fees for.
     * @param to                        The address to send the fees to.
     */
    function withdrawProtocolFees(
        address token,
        address to
    ) external override nonReentrant onlyRole(FEE_CLAIMER_ROLE) {
        if (token == address(0)) revert LC_ZeroAddress("token");
        if (to == address(0)) revert LC_ZeroAddress("to");

        // any token balances remaining on this contract are fees owned by the protocol
        mapping(address => uint256)
            storage _feesWithdrawable = feesWithdrawable[token];
        uint256 amount = _feesWithdrawable[address(this)];
        _feesWithdrawable[address(this)] = 0;

        _transferIfNonzero(IERC20(token), to, amount);

        emit FeesWithdrawn(token, msg.sender, to, amount);
    }

    // ======================================== ADMIN FUNCTIONS =========================================

    /**
     * @notice Shuts down the contract, callable by a designated role. Irreversible.
     *         When the contract is shutdown, loans can only be repaid.
     *         New loans cannot be started, defaults cannot be claimed,
     *         loans cannot be rolled over, and vault utility cannot be
     *         employed. This is an emergency recovery feature.
     */
    function shutdown() external onlyRole(SHUTDOWN_ROLE) {
        _pause();
    }

    // ============================================= HELPERS ============================================

    /**
     * @dev Perform shared logic across repay operations repay and forceRepay - all "checks" and "effects".
     *      Will validate loan state, perform accounting calculations, update storage and burn loan notes.
     *      Transfers should occur in the calling function.
     *
     * @param loanId                 The ID of the loan to repay.
     * @param _amountToLender        The amount of tokens to be distributed to the lender (net after fees).
     * @param _interestAmount        The amount of interest to be paid.
     * @param _paymentToPrincipal    The amount of principal to be paid.
     *
     * @return data                  The loan data for the repay operation.
     * @return amountFromPayer       The principal plus interest to be collected from the payer.
     */
    function _handleRepay(
        uint256 loanId,
        uint256 _amountToLender,
        uint256 _interestAmount,
        uint256 _paymentToPrincipal
    )
        internal
        returns (LoanLibrary.LoanData memory data, uint256 amountFromPayer)
    {
        data = loans[loanId];
        // Ensure valid initial loan state when repaying loan
        if (data.state != LoanLibrary.LoanState.Active)
            revert Invalid_Loan_State();

        amountFromPayer = _paymentToPrincipal + _interestAmount;

        // Check that we will not net lose tokens
        if (_amountToLender > amountFromPayer)
            revert LC_CannotSettle(_amountToLender, amountFromPayer);
        // Check that the payment to principal is not greater than the balance
        if (_paymentToPrincipal > data.balance)
            revert LC_ExceedsBalance(_paymentToPrincipal, data.balance);

        uint256 feesEarned;
        unchecked {
            feesEarned = amountFromPayer - _amountToLender;
        }

        (
            uint256 protocolFee,
            uint256 affiliateFee,
            address affiliate
        ) = _getAffiliateSplit(feesEarned, data.terms.affiliateCode);

        // Assign fees for withdrawal
        mapping(address => uint256)
            storage _feesWithdrawable = feesWithdrawable[
                data.terms.payableCurrency
            ];
        if (protocolFee > 0) _feesWithdrawable[address(this)] += protocolFee;
        if (affiliateFee > 0) _feesWithdrawable[affiliate] += affiliateFee;

        // state changes
        if (_paymentToPrincipal == data.balance) {
            // If the payment is equal to the balance, the loan is repaid
            loans[loanId].state = LoanLibrary.LoanState.Repaid;
            // mark collateral as no longer escrowed
            collateralInUse[
                keccak256(
                    abi.encode(
                        data.terms.collateralAddress,
                        data.terms.collateralId
                    )
                )
            ] = false;
        }

        loans[loanId].interestAmountPaid += _interestAmount;
        loans[loanId].balance -= _paymentToPrincipal;
        loans[loanId].lastAccrualTimestamp = uint64(block.timestamp);
    }

    /**
     * @dev Consume a nonce, by marking it as used for that user. Reverts if the nonce
     *      has already been used.
     *
     * @param user                  The user for whom to consume a nonce.
     * @param nonce                 The nonce to consume.
     */
    function _useNonce(address user, uint160 nonce) internal {
        mapping(uint160 => bool) storage _usedNonces = usedNonces[user];

        if (_usedNonces[nonce]) revert LC_NonceUsed(user, nonce);
        // set nonce to used
        _usedNonces[nonce] = true;

        emit NonceUsed(user, nonce);
    }

    /**
     * @dev Perform an ERC20 transfer, if the specified amount is nonzero - else no-op.
     *
     * @param token                 The token to transfer.
     * @param to                    The address receiving the tokens.
     * @param amount                The amount of tokens to transfer.
     */
    function _transferIfNonzero(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        if (amount > 0) token.safeTransfer(to, amount);
    }

    function _collectIfNonzero(
        IERC20 token,
        address from,
        uint256 amount
    ) internal {
        if (amount > 0) token.safeTransferFrom(from, address(this), amount);
    }

    /**
     * @dev Blocks the contract from unpausing once paused.
     */
    function _unpause() internal override whenPaused {
        revert LC_Shutdown();
    }
}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./Whitelister.sol";
import "./interfaces/ILoanCore.sol";
import "./libraries/FacilitatorLib.sol";

contract LoanCore is Whitelister, ILoanCore, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============================================ STATE ==============================================

    IERC20 public USDC;
    IERC20 public GHO;

    // =================== Constants =====================

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant ORIGINATOR_ROLE = keccak256("ORIGINATOR");
    uint256 private constant BASIS_POINTS_DENOMINATOR = 1e4;

    // =================== Loan State =====================

    uint256 private loanIdTracker;
    uint256 public interestRate = 1e3; // 10.00 %

    mapping(uint256 => LoanLibrary.LoanData) public loans;
    mapping(address => mapping(uint160 => bool)) public usedNonces;
    ///      Key is hash of (collateralAddress, collateralId).
    mapping(bytes32 => bool) private collateralInUse;

    // ========================================== CONSTRUCTOR ===========================================

    constructor(
        address usdc,
        address gho,
        address nftWhitelister,
        address destinationWhitelister,
        bytes32 roleAdmin
    ) Whitelister(nftWhitelister, destinationWhitelister, roleAdmin) {
        USDC = IERC20(usdc);
        GHO = IERC20(gho);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    }

    // ====================================== LIFECYCLE OPERATIONS ======================================

    function startLoan(
        address borrowTo,
        LoanLibrary.LoanTerms calldata terms
    )
        external
        override
        whenNotPaused
        onlyWhitelistedNFT(terms.collateralAddress)
        onlyWhitelistedDestination(terms.destinationChain)
        nonReentrant
        returns (uint256 loanId)
    {
        // Check collateral is not already used in a loan
        bytes32 collateralKey = keccak256(
            abi.encode(terms.collateralAddress, terms.collateralId)
        );
        if (collateralInUse[collateralKey]) revert Collateral_In_Use();

        uint256 floorPriceUSD; // = Chainlink.getPrice(terms.collectionId);
        uint256 maxBorrowable = calculateCollateralValue(floorPriceUSD);

        if (terms.principal > maxBorrowable)
            revert Exceeds_Maximum_Borrowable();

        if (terms.principal > 0) collateralInUse[collateralKey] = true;

        // collect the NFT to the vault
        IERC721(terms.collateralAddress).transferFrom(
            msg.sender,
            address(this),
            terms.collateralId
        );

        loanId = loanIdTracker;
        unchecked {
            loanIdTracker++;
        }

        // Initiate loan state
        loans[loanId] = LoanLibrary.LoanData({
            state: LoanLibrary.LoanState.Active,
            startDate: uint64(block.timestamp),
            lastAccrualTimestam: uint64(block.timestamp),
            entryPrice: floorPriceUSD,
            balance: terms.principal,
            interestAmountPaid: 0,
            allowance: maxBorrowable - terms.principal,
            terms: terms
        });

        if (terms.facilitator == LoanLibrary.Facilitator.Native) {
            // handleNative();
        } else {
            // create the approval to aave pool
            USDC.approve(address(FacilitatorLib.aaveV3Pool), terms.principal);

            // supply the asset to Aave
            FacilitatorLib.supplyAaveUSDC(
                address(USDC),
                maxBorrowable,
                address(this)
            );

            // Borrow GHO
            FacilitatorLib.borrowAaveGHO(
                address(GHO),
                maxBorrowable,
                address(this)
            );
        }

        // send GHO to the borrower (borrowTo)

        if (terms.principal > 0) {
            if (getChainId() == terms.destinationChain) {
                GHO.safeTransfer(borrowTo, terms.principal);
            } else {
                // bridge with CCIP
            }
        }

        // evaluate available GHO for secondary pool
        uint256 amountOverCollateralized = floorPriceUSD - maxBorrowable;

        if (maxBorrowable > terms.principal) {
            unchecked {
                amountOverCollateralized += maxBorrowable - terms.principal;
            }
        }

        /// enter Savvy for risk management revenue

        // create the approval to savvy pool
        GHO.approve(
            address(FacilitatorLib.savvyPool),
            amountOverCollateralized
        );

        // supply GHO into Savvy
        FacilitatorLib.supplySavvyGHO(
            address(GHO),
            amountOverCollateralized,
            address(this),
            0
        );
    }

    function repayDebt(
        uint256 loanId,
        uint256 amount
    ) external override nonReentrant {
        uint256 interest = calculateInterest(loanId);
        (
            LoanLibrary.LoanData memory data,
            uint256 amountFromPayer
        ) = _handleRepay(loanId, interest, amount);

        // collect principal and interest from borrower
        GHO.safeTransferFrom(msg.sender, address(this), amount + interest);

        if (loans[loanId].state == LoanLibrary.LoanState.Repaid) {
            // redistribute collateral and emit event
            IERC721(data.terms.collateralAddress).safeTransferFrom(
                address(this),
                msg.sender,
                data.terms.collateralId
            );

            emit LoanRepaid(loanId);
        }

        emit LoanPayment(loanId);
    }

    function calculateCollateralValue(
        uint256 amount
    ) public pure returns (uint256) {
        return (amount * 70) / 100;
    }

    function calculateInterest(
        uint256 loanId
    ) public view returns (uint256 interestAmountDue) {
        LoanLibrary.LoanData memory loanData = loans[loanId];

        if (loanData.balance > 0) {
            uint256 timeSinceLastPayment = block.timestamp -
                loanData.lastAccrualTimestam;

            interestAmountDue =
                (loanData.balance * timeSinceLastPayment * interestRate) /
                (BASIS_POINTS_DENOMINATOR * 365 days);
        }
    }

    function _handleRepay(
        uint256 loanId,
        uint256 _interestAmount,
        uint256 _paymentToPrincipal
    ) internal returns (LoanLibrary.LoanData memory data, uint256 total) {
        data = loans[loanId];
        LoanLibrary.LoanData storage _data = loans[loanId];
        if (data.state != LoanLibrary.LoanState.Active) revert Invalid_State();

        total = _paymentToPrincipal + _interestAmount;

        // Check that the payment to principal is not greater than the balance
        if (_paymentToPrincipal > data.balance)
            revert Exceeds_Balance(_paymentToPrincipal, data.balance);

        // state changes
        if (_paymentToPrincipal == data.balance) {
            // If the payment is equal to the balance, the loan is repaid
            _data.state = LoanLibrary.LoanState.Repaid;
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

        _data.interestAmountPaid += _interestAmount;
        _data.balance -= _paymentToPrincipal;
        _data.lastAccrualTimestamp = uint64(block.timestamp);
        data = _data;
    }
}

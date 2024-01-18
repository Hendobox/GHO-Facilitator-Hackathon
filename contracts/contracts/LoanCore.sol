// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./Whitelister.sol";
import "./RiskManagementSender.sol";
import "./interfaces/ILoanCore.sol";
import "./Chainlink.sol";
import "./Facilitator.sol";
import "hardhat/console.sol";

contract LoanCore is
    RiskManagementSender,
    Chainlink,
    Facilitator,
    Whitelister,
    ILoanCore,
    Pausable,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    // ============================================ STATE ==============================================

    IERC20 public USDC;
    IERC20 public GHO;
    IERC20 public aTokenUSDC;
    address public receiver;
    address public destinationGHO;

    // =================== Constants =====================

    uint256 private constant BASIS_POINTS_DENOMINATOR = 1e4;

    // =================== Loan State =====================

    uint256 public loanIdTracker;
    uint256 public interestRate = 1e3; // 10.00 %

    mapping(uint256 => LoanLibrary.LoanData) public loans;
    mapping(address => mapping(uint160 => bool)) public usedNonces;
    ///      Key is hash of (collateralAddress, collateralId).
    mapping(bytes32 => bool) private collateralInUse;

    // ========================================== CONSTRUCTOR ===========================================

    constructor(
        address usdc,
        address gho,
        address aTokenUsdc,
        address owner_,
        address ccipRouter,
        address receiver_,
        uint64 _destinationChainSelector
    )
        Whitelister(owner_)
        RiskManagementSender(ccipRouter, _destinationChainSelector)
    {
        USDC = IERC20(usdc);
        GHO = IERC20(gho);
        aTokenUSDC = IERC20(aTokenUsdc);
        receiver = receiver_;
    }

    // ====================================== LIFECYCLE OPERATIONS ======================================

    function startLoan(
        LoanLibrary.LoanTerms calldata terms
    )
        external
        override
        whenNotPaused
        onlyWhitelistedNFT(terms.collateralAddress)
        nonReentrant
        returns (uint256 loanId)
    {
        // Check collateral is not already used in a loan
        bytes32 collateralKey = keccak256(
            abi.encode(terms.collateralAddress, terms.collateralId)
        );
        if (collateralInUse[collateralKey]) revert Collateral_In_Use();

        uint256 floorPriceUSD = uint256(getLatestPrice());
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
            lastAccrualTimestamp: uint64(block.timestamp),
            entryPrice: floorPriceUSD,
            balance: terms.principal,
            interestAmountPaid: 0,
            allowance: maxBorrowable - terms.principal,
            terms: terms,
            owner: msg.sender
        });

        if (terms.facilitator == LoanLibrary.Facilitator.Native) {
            // handleNative();
        } else {
            // create the approval to aave pool
            USDC.approve(address(aaveV3Pool), maxBorrowable);

            // supply the asset to Aave
            supplyAaveUSDC(address(USDC), maxBorrowable, address(this));

            (, , uint256 availableBorrowsBase, , , ) = getUserAccountData(
                address(this)
            );

            // console.log("availableBorrowsBase: ", availableBorrowsBase);

            if (availableBorrowsBase > maxBorrowable) {
                // Borrow GHO
                borrowAaveGHO(address(GHO), maxBorrowable, address(this));
            } else {
                // handleNative();
            }
        }

        // send GHO to the borrower

        if (terms.principal > 0) {
            GHO.safeTransfer(msg.sender, terms.principal);
        }

        // evaluate available GHO for secondary pool in cross-chain with CCIP

        uint256 amountOverCollateralized = floorPriceUSD - maxBorrowable;
        uint256 userBal = maxBorrowable - terms.principal;

        // enter Savvy for risk management revenue

        supplySavvyCCIP(
            receiver,
            amountOverCollateralized,
            userBal,
            msg.sender
        );
    }

    function repayDebt(
        uint256 loanId,
        uint256 amountPlusInterest
    ) external override nonReentrant {
        if (amountPlusInterest == 0) revert Zero_Amount();

        LoanLibrary.LoanData memory data = loans[loanId];
        LoanLibrary.LoanData storage _data = loans[loanId];
        if (data.state != LoanLibrary.LoanState.Active) revert Invalid_State();
        if (data.owner != msg.sender) revert Unauthorized();

        uint256 interest = calculateInterest(loanId);
        uint256 debt = data.balance + interest;

        // Check that the payment to principal is not greater than the balance
        if (amountPlusInterest > debt) revert Exceeds_Balance();

        // collect principal and interest from borrower
        GHO.safeTransferFrom(msg.sender, address(this), amountPlusInterest);

        if (data.terms.facilitator == LoanLibrary.Facilitator.Native) {
            // handleNativeRepay();
        } else {
            // (, uint256 totalDebtBase, , , uint256 ltv, ) = getUserAccountData(
            //     address(this)
            // );

            // console.log("totalDebtBase:", totalDebtBase);
            // console.log("ltv:", ltv);

            // create the approval to aave pool
            GHO.approve(address(aaveV3Pool), amountPlusInterest);

            // Borrow GHO
            repayAave(address(GHO), amountPlusInterest, 2, address(this));
        }

        // state changes
        if (amountPlusInterest == debt) {
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

            // redistribute collateral and emit event
            IERC721(data.terms.collateralAddress).safeTransferFrom(
                address(this),
                msg.sender,
                data.terms.collateralId
            );

            emit LoanRepaid(loanId);
        }

        _data.interestAmountPaid += interest;
        _data.balance -= amountPlusInterest - interest;
        _data.lastAccrualTimestamp = uint64(block.timestamp);

        // handle repayment

        emit LoanPayment(loanId);
    }

    function claim(
        uint256 loanId
    ) external override whenNotPaused nonReentrant {
        LoanLibrary.LoanData memory data = loans[loanId];
        // Ensure valid initial loan state when claiming loan
        if (data.state != LoanLibrary.LoanState.Active) revert Invalid_State();

        uint256 floorPriceUSD = uint256(getLatestPrice());
        uint256 maxBorrowable = calculateCollateralValue(floorPriceUSD);

        if (maxBorrowable > data.balance) revert Not_Unhealthy();

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

        uint256 interest = calculateInterest(loanId);

        GHO.safeTransferFrom(
            msg.sender,
            address(this),
            data.balance + interest
        );

        // Collateral redistribution
        IERC721(data.terms.collateralAddress).safeTransferFrom(
            address(this),
            msg.sender,
            data.terms.collateralId
        );

        emit LoanClaimed(loanId);
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
                loanData.lastAccrualTimestamp;

            interestAmountDue =
                (loanData.balance * timeSinceLastPayment * interestRate) /
                (BASIS_POINTS_DENOMINATOR * 365 days);
        }
    }
}

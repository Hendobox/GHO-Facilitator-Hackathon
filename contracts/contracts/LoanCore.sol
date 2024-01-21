// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./internal/Whitelister.sol";
import "./internal/CCIP_Sender.sol";
import "./interfaces/ILoanCore.sol";
import "./libraries/ChainlinkDataLib.sol";
import "./libraries/AaveFacilitatorLib.sol";
import "hardhat/console.sol";

contract unHODL is
    CCIP_Sender,
    Whitelister,
    ILoanCore,
    Pausable,
    IERC721Receiver,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    // ============================================ STATE ==============================================

    IERC20 public USDC;
    IERC20 public GHO;
    IERC20 public aTokenUSDC;
    address public receiver;
    uint256 private constant BASIS_POINTS_DENOMINATOR = 1e4;
    uint256 public loanIdTracker;
    uint256 public interestRate = 1e3; // 10.00 %
    uint256 public usdcTreasuryBalance;
    uint256 public ghoTreasuryBalance;

    mapping(uint256 => LoanLibrary.LoanData) private loans;
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
    ) Whitelister(owner_) CCIP_Sender(ccipRouter, _destinationChainSelector) {
        USDC = IERC20(usdc);
        GHO = IERC20(gho);
        aTokenUSDC = IERC20(aTokenUsdc);
        receiver = receiver_;
    }

    // ====================================== LIFECYCLE OPERATIONS ======================================

    function demo_purpose_addUsdcToTreasury(uint256 amount) external onlyOwner {
        USDC.safeTransferFrom(msg.sender, address(this), amount);
        unchecked {
            usdcTreasuryBalance += amount;
        }
    }

    function demo_purpose_addGhoToTreasury(uint256 amount) external onlyOwner {
        GHO.safeTransferFrom(msg.sender, address(this), amount);
        unchecked {
            ghoTreasuryBalance += amount;
        }
    }

    // to recover assets from demo contract to final version
    function drain(address to) external onlyOwner {
        uint256 ghoBalance = GHO.balanceOf(address(this));
        uint256 usdcBalance = USDC.balanceOf(address(this));
        uint256 ethBalance = address(this).balance;

        if (ghoBalance > 0) {
            ghoTreasuryBalance -= ghoBalance;
            GHO.safeTransfer(to, ghoBalance);
        }

        if (usdcBalance > 0) {
            usdcTreasuryBalance -= usdcBalance;
            GHO.safeTransfer(to, usdcBalance);
        }

        if (ethBalance > 0) {
            (bool success, ) = payable(to).call{value: ethBalance}("");
            require(success, "ETH transfer error");
        }
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

        uint256 floorPriceUSD = uint256(
            ChainlinkDataLib.getLatestPrice() * 10e11
        );
        uint256 maxBorrowable = calculateCollateralValue(floorPriceUSD, true);

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

        uint256 availableBorrowsBase;
        uint256 amountOverCollateralized;
        uint256 max;

        if (terms.facilitator == LoanLibrary.Facilitator.Native) {
            _nativeFacilitator(terms.principal);
            availableBorrowsBase = calculateCollateralValue(
                floorPriceUSD,
                false
            );
            amountOverCollateralized = availableBorrowsBase - maxBorrowable;
            max = maxBorrowable;
        } else {
            uint256 floorPriceUsdAave = floorPriceUSD / 10e11;
            uint256 maxBorrowableAave = maxBorrowable / 10e11;
            // create the approval to aave pool
            USDC.approve(
                address(AaveFacilitatorLib.aaveV3Pool),
                floorPriceUsdAave
            );

            usdcTreasuryBalance -= maxBorrowableAave;

            // supply the USDC asset to Aave
            AaveFacilitatorLib.supplyAaveUSDC(
                address(USDC),
                floorPriceUsdAave,
                address(this)
            );

            (, , availableBorrowsBase, , , ) = AaveFacilitatorLib
                .getUserAccountData(address(this));

            console.log("availableBorrowsBase: ", availableBorrowsBase / 10e8);
            console.log("maxBorrowable", maxBorrowable);
            console.log("maxBorrowableAave", maxBorrowableAave);

            if (availableBorrowsBase > maxBorrowableAave) {
                // Borrow GHO from Aave
                AaveFacilitatorLib.borrowAaveGHO(
                    address(GHO),
                    maxBorrowable,
                    address(this)
                );
            } else {
                revert Margin_Error(); // our 30% collateral will cover for Aave's 20%. this is assumint the rates do not change
            }

            amountOverCollateralized = availableBorrowsBase - maxBorrowableAave;
            max = availableBorrowsBase;
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

        // send GHO to the borrower

        if (terms.principal > 0) {
            GHO.safeTransfer(msg.sender, terms.principal);
        }

        uint256 userBal = maxBorrowable - terms.principal;

        // enter Savvy for risk management revenue

        supplySavvyCCIP(
            address(GHO),
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
            ghoTreasuryBalance += amountPlusInterest;
        } else {
            // (, uint256 totalDebtBase, , , uint256 ltv, ) = AaveFacilitatorLib.getUserAccountData(
            //     address(this)
            // );

            // console.log("totalDebtBase:", totalDebtBase);
            // console.log("ltv:", ltv);

            // create the approval to aave pool
            GHO.approve(
                address(AaveFacilitatorLib.aaveV3Pool),
                amountPlusInterest
            );

            // Borrow GHO
            AaveFacilitatorLib.repayAave(
                address(GHO),
                amountPlusInterest,
                2,
                address(this)
            );
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

        uint256 floorPriceUSD = uint256(ChainlinkDataLib.getLatestPrice());
        uint256 maxBorrowable = calculateCollateralValue(floorPriceUSD, true);

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
        uint256 amount,
        bool withAave
    ) public pure returns (uint256) {
        if (withAave) {
            return ((amount * 70) / 100);
        } else {
            return ((amount * 95) / 100);
        }
    }

    function calculateInterest(
        uint256 loanId
    ) public view returns (uint256 interestAmountDue) {
        LoanLibrary.LoanData memory loanData = loans[loanId];

        if (loanData.balance > 0) {
            uint256 timeSinceLastPayment = block.timestamp -
                loanData.lastAccrualTimestamp;

            timeSinceLastPayment /= 1 days;

            interestAmountDue =
                (loanData.balance * timeSinceLastPayment * interestRate) /
                (BASIS_POINTS_DENOMINATOR * 365);
        }
    }

    function getLatestPrice() external view returns (int256) {
        return ChainlinkDataLib.getLatestPrice();
    }

    function getLoan(
        uint256 loanId
    ) external view returns (LoanLibrary.LoanData memory loanData) {
        return loans[loanId];
    }

    function _nativeFacilitator(uint256 amount) private {
        if (amount > 0) {
            if (amount > ghoTreasuryBalance) revert Bucket_Oversused();
            ghoTreasuryBalance -= amount;
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        require(
            msg.sender == address(this),
            "Only unHODL contract allowed to collect"
        );

        return IERC721Receiver.onERC721Received.selector;
    }
}

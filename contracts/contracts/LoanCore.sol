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

    // =================== Loan State =====================

    uint256 private loanIdTracker;
    mapping(uint256 => LoanLibrary.LoanData) public loans;
    mapping(address => mapping(uint160 => bool)) public usedNonces;

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
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(ORIGINATOR_ROLE, ADMIN_ROLE);
    }

    // ====================================== LIFECYCLE OPERATIONS ======================================

    function startLoan(
        address lender,
        address borrower,
        LoanLibrary.LoanTerms calldata terms
    )
        external
        override
        whenNotPaused
        onlyWhitelistedNFT(terms.collateralAddress)
        onlyWhitelistedDestination(terms.destinationChain)
        onlyRole(ORIGINATOR_ROLE)
        nonReentrant
        returns (uint256 loanId)
    {
        uint256 floorPriceUSD; // = Chainlink.getPrice(terms.collectionId);
        uint256 maxBorrowable = calculateCollateralValue(floorPriceUSD);

        if (terms.principal > maxBorrowable)
            revert Exceeds_Maximum_Borrowable();

        // collect the NFT to the vault
        IERC721(terms.collateralAddress).transferFrom(
            lender,
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
            entryPrice: uint64(floorPriceUSD),
            balance: terms.principal,
            interestAmountPaid: 0,
            terms: terms
        });

        if (terms.facilitator == LoanLibrary.Facilitator.Native) {
            // handleNative();
        } else {
            // create the approval to aave pool
            USDC.approve(address(FacilitatorLib.aaveV3Pool), terms.principal);

            // // supply the asset to Aave
            // FacilitatorLib.supplyUSDC(address(USDC), maxBorrowable, treasury);

            // // Borrow GHO
            // FacilitatorLib.borrowGHO(address(GHO), maxBorrowable, treasury);
        }

        // send GHO to the borrower

        if (terms.principal > 0) {
            uint64 chainId;
            assembly {
                chainId := chainid()
            }
            if (chainId == terms.destinationChain) {
                GHO.safeTransfer(borrower, terms.principal);
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

        // enter Savvy for risk management revenue

        //
    }

    function calculateCollateralValue(
        uint256 amount
    ) public pure returns (uint256) {
        return (amount * 70) / 100;
    }
}

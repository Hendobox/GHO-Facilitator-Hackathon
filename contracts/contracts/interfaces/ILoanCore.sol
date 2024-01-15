// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "../libraries/LoanLibrary.sol";

interface ILoanCore {
    // ================ Data Types =================

    struct AffiliateSplit {
        address affiliate;
        uint96 splitBps;
    }

    struct NoteReceipt {
        address token;
        uint256 amount;
    }

    // ================ Events =================

    event LoanStarted(uint256 loanId, address lender, address borrower);
    event LoanPayment(uint256 loanId);
    event LoanRepaid(uint256 loanId);
    event ForceRepay(uint256 loanId);
    event LoanRolledOver(uint256 oldLoanId, uint256 newLoanId);
    event LoanClaimed(uint256 loanId);
    event NoteRedeemed(
        address indexed token,
        address indexed caller,
        address indexed to,
        uint256 tokenId,
        uint256 amount
    );
    event NonceUsed(address indexed user, uint160 nonce);

    event FeesWithdrawn(
        address indexed token,
        address indexed caller,
        address indexed to,
        uint256 amount
    );
    event AffiliateSet(
        bytes32 indexed code,
        address indexed affiliate,
        uint96 splitBps
    );

    // ============== Lifecycle Operations ==============

    function startLoan(
        address lender,
        address borrower,
        LoanLibrary.LoanTerms calldata terms
    ) external returns (uint256 loanId);

    // function repay(
    //     uint256 loanId,
    //     address payer,
    //     uint256 _amountToLender,
    //     uint256 _interestAmount,
    //     uint256 _paymentToPrincipal
    // ) external;

    // function claim(uint256 loanId, uint256 _amountFromLender) external;

    // // ============== Nonce Management ==============

    // function consumeNonce(address user, uint160 nonce) external;

    // function cancelNonce(uint160 nonce) external;

    // // ============== Fee Management ==============

    // function withdraw(address token, uint256 amount, address to) external;

    // // ============== View Functions ==============

    // function getLoan(
    //     uint256 loanId
    // ) external view returns (LoanLibrary.LoanData calldata loanData);

    // function isNonceUsed(
    //     address user,
    //     uint160 nonce
    // ) external view returns (bool);
}

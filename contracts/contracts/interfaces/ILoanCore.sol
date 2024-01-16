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
    event LoanClaimed(uint256 loanId);
    event NonceUsed(address indexed user, uint160 nonce);

    // ============== Lifecycle Operations ==============

    function startLoan(
        address lender,
        LoanLibrary.LoanTerms calldata terms
    ) external returns (uint256 loanId);

    function repayDebt(uint256 loanId, uint256 amount) external;

    function claim(uint256 loanId) external;

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

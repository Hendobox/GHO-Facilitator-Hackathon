// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "../libraries/LoanLibrary.sol";

interface ILoanCore {
    // ================ Events =================

    event LoanStarted(uint256 loanId, address lender, address borrower);
    event LoanPayment(uint256 loanId);
    event LoanRepaid(uint256 loanId);
    event LoanClaimed(uint256 loanId);
    event NonceUsed(address indexed user, uint160 nonce);

    // ============== Lifecycle Operations ==============

    function startLoan(
        LoanLibrary.LoanTerms calldata terms
    ) external returns (uint256 loanId);

    function repayDebt(uint256 loanId, uint256 amount) external;

    function claim(uint256 loanId) external;

    function getLatestPrice() external view returns (int256);

    function getLoan(
        uint256 loanId
    ) external view returns (LoanLibrary.LoanData memory loanData);

    function calculateCollateralValue(
        uint256 amount,
        bool withAave
    ) external pure returns (uint256);

    function calculateInterest(
        uint256 loanId
    ) external view returns (uint256 interestAmountDue);
}

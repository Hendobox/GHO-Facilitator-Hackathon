// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./ILoanCore.sol";

interface IMigrationWithItems {
    struct OperationDataWithItems {
        uint256 loanId;
        address borrower;
        LoanLibrary.LoanTerms newLoanTerms;
        address lender;
        uint160 nonce;
        uint8 v;
        bytes32 r;
        bytes32 s;
        LoanLibrary.Predicate[] itemPredicates;
    }

    function migrateLoanWithItems(
        uint256 loanId,
        LoanLibrary.LoanTerms calldata newLoanTerms,
        address lender,
        uint160 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s,
        LoanLibrary.Predicate[] calldata itemPredicates
    ) external;
}

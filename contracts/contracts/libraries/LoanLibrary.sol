// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

library LoanLibrary {
    enum LoanState {
        DUMMY_DO_NOT_USE,
        Active,
        Repaid,
        Defaulted
    }

    enum Facilitator {
        // If using the native facilitator
        Native,
        // If using the AaveV3 facilitator
        AaveV3
    }

    struct LoanTerms {
        address collateralAddress;
        uint256 collateralId;
        uint256 principal;
        uint64 destinationChain;
        Facilitator facilitator;
    }

    struct LoanData {
        LoanState state;
        uint64 startDate;
        uint64 entryPrice;
        uint256 balance; // total principal minus amount of principal repaid
        uint256 interestAmountPaid;
        LoanTerms terms;
    }
}

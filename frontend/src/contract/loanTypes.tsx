export enum LoanState {
    DUMMY_DO_NOT_USE,
    Active,
    Repaid,
    Defaulted
}

export interface LoanTerms {
    collateralAddress: string; // crypto punk address
    collateralId: bigint; // dummy token id of nft
    principal: bigint; // input borrowing amount, max borrowable buttn pull data from contract fn
    facilitator: number; // aave or our facilitator input
}

export interface RepayTerms {
    loanId: bigint,
    amount: bigint
}

export interface LoanData {
    id: number;
    state: LoanState;
    startDate: bigint;
    lastAccrualTimestamp: bigint;
    entryPrice: bigint;
    balance: bigint;
    interestAmountPaid: bigint;
    allowance: bigint;
    terms: LoanTerms;
    owner: string;
}
type BorrowStep = {
    title: string
    subtitle: string
    step: number
}

export const borrowSteps: BorrowStep[] = [
    {
        title: 'Select Collateral',
        subtitle: 'Begin your borrowing process by setting assets you wish to use as collateral',
        step: 1,
    },
    {
        title: 'Review Loan Terms',
        subtitle: 'You’ve added the following assets as collateral. Confirm terms and proceed',
        step: 2,
    },
    {
        title: 'Review & Confirm',
        subtitle: 'Review your transaction details and confirm',
        step: 3,
    },
]
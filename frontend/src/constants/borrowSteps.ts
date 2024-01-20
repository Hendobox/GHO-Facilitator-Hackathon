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
        title: 'Choose product',
        subtitle: 'Select which product best serves your needs. Don’t panic you can change this later',
        step: 2,
    },
    {
        title: 'Review Loan Terms',
        subtitle: 'You’ve added the following assets as collateral. Confirm terms and proceed',
        step: 3,
    },
    {
        title: 'Review & Confirm',
        subtitle: 'Review your transaction details and confirm',
        step: 4,
    },
]
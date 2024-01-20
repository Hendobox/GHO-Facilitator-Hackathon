interface LoanAmountProps {
    data?: number
}


export default function LoanAmount(props: LoanAmountProps) {
    const loanAmount: number = 7412
    return (
        <>
            <div className="text-sm mb-2 font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Loan amount
            </div>
            <div className="text-lg" >
                {props.data?.toLocaleString('en-IN') ?? loanAmount.toLocaleString('en-IN')} GHO
            </div>
        </>
    )
}
function NoLoan() {
    return (
        <>
            <div className="flex flex-col gap-4 w-full items-start">
                <div className="mt-4 text-center text-sm font-medium leading-[24px] text-[#a1a1aa] ml-20">
                    No active loan
                </div>
                <button
                    id="Button1"
                    className="text-sm font-medium leading-[24px] text-white border-solid border-[#6d28d9] flex flex-row justify-center pt-3 w-full h-12 cursor-pointer items-start border rounded"
                >
                    Borrow
                </button>
            </div >
        </>
    )
}

function Loan() {
    return (
        <>
            <div className="flex flex-row gap-1 mt-4 font-['Inter'] items-start">
                <div className="text-center text-xl font-semibold tracking-[-0.1] leading-[28px] text-white">
                    13 000 GHO
                </div>
                <div className="text-xs font-medium leading-[16px] text-[#a1a1aa] mt-1">
                    5.4% APY
                </div>
            </div>
            <div className="mt-4 text-sm font-medium leading-[14px] text-white">
                Due Repayment Progress
            </div>

            {/* TODO: Replace with Progress bar ui */}
            <div
                id="Progress"
                className="mt-4 bg-[#27272a] flex flex-row w-full items-start rounded"
            >
                <img
                    src="https://file.rendit.io/n/AIhlrgr6PYH6L2WciDVH.svg"
                    alt="Completed"
                    id="Completed"
                    className="w-24"
                />
            </div>
        </>
    )
}

interface LoanSummaryProps {
    data: {}
}

export default function LoanSummary(props: LoanSummaryProps) {
    return (
        <>
            <div className="text-sm font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Loan Summary
            </div>
            {props.data ? <Loan /> : <NoLoan />}
        </>
    )
}
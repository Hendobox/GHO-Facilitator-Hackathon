export default function LoanSummary() {
    return (
        <>
            <div className="text-sm font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Loan Summary
            </div>
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
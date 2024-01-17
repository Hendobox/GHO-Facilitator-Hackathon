export default function AvailableBuffer() {
    return (
        <>
            <div className="text-sm font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Available collateral buffer
            </div>
            <div
                className="mt-4 bg-[#27272a] flex flex-col justify-center pl-4 gap-3 w-full h-20 items-start rounded-lg"
            >
                <div className="flex flex-row gap-2 w-3/5 items-start">
                    <div className="text-sm font-medium leading-[14px] text-white">
                        5 000 GHO
                    </div>
                    <div className="text-xs font-medium leading-[16px] text-[#a1a1aa]">
                        3.4% APY
                    </div>
                </div>
                <div className="flex flex-row gap-10 w-full items-start">
                    <div className="text-xs font-medium leading-[14px] text-[#a1a1aa]">
                        Interest earned:
                    </div>
                    <div className="flex flex-row gap-3  items-start">
                        <div className="text-right text-xs font-medium leading-[14px] text-white">
                            219.45 GHO
                        </div>
                        <img
                            src="https://file.rendit.io/n/JVsOxvGz2imD7AFZrA5A.svg"
                            alt="Sparkline"
                            id="Sparkline"
                            className="mt-1 w-4"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
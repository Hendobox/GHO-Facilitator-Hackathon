export default function WalletBalance() {
    return (
        <>
            <div className="text-sm font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Wallet balance
            </div>
            <div className="mt-4 flex flex-col gap-2 w-full items-start">
                <div className="flex flex-row justify-between w-full items-start">
                    <div className="text-sm font-medium leading-[14px] text-white">
                        Ethereum
                    </div>
                    <div className="text-right text-sm font-medium leading-[14px] text-white">
                        $74 545.67
                    </div>
                </div>
                <div className="flex flex-row justify-between w-full items-start">
                    <div className="text-xs font-medium leading-[14px] text-[#a1a1aa]">
                        ETH
                    </div>
                    <div className="text-right text-xs font-medium leading-[14px] text-[#a1a1aa]">
                        39.4 ETH
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 w-full font-['Inter'] items-start">
                <div className="flex flex-row justify-between w-full items-start">
                    <div className="text-sm font-medium leading-[14px] text-white">
                        GHO token
                    </div>
                    <div className="text-right text-sm font-medium leading-[14px] text-white">
                        $74 545.67
                    </div>
                </div>
                <div className="flex flex-row justify-between w-full items-start">
                    <div className="text-xs font-medium leading-[14px] text-[#a1a1aa]">
                        GHO
                    </div>
                    <div className="text-right text-xs font-medium leading-[14px] text-[#a1a1aa]">
                        74 545.67 GHO
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-row justify-between w-full font-['Inter'] items-start">
                <div className="text-sm font-medium leading-[14px] text-white">NFTs</div>
                <div className="text-right text-sm font-medium leading-[14px] text-white">
                    3
                </div>
            </div>
        </>
    )
}
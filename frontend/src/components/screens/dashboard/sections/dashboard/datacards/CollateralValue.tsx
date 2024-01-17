interface CollateralValueProps {
    data: {}
}

function NoCollateral() {
    return (
        <div className="h-full flex flex-row justify-center items-center pb-4">
            <div className="text-center text-sm font-medium leading-[24px] text-[#a1a1aa]">
                No active collateral buffer
            </div>
        </ div>
    )
}

function Collateral() {
    return (
        <>
            <div
                className="mt-4 bg-[#27272a] flex flex-col justify-center pl-4 gap-3 w-full h-20 items-start rounded-lg"
            >
                <div className="flex flex-row gap-2 w-5/6 items-start">
                    <div className="text-sm font-medium leading-[14px] text-white mt-px">
                        The blooming eyes of Delhi
                    </div>
                    <img
                        src="https://file.rendit.io/n/tyfNpu8LBJ2cnU3xt2r1.svg"
                        alt="Iconexternallink"
                        id="Iconexternallink"
                        className="w-4"
                    />
                </div>
                <div className="flex flex-row gap-5 w-full items-start">
                    <div className="text-xs font-medium leading-[14px] text-[#a1a1aa]">
                        Current market value:
                    </div>
                    <div className="flex flex-row gap-3  items-start">
                        <div className="text-right text-xs font-medium leading-[14px] text-white">
                            4.2 WETH
                        </div>
                        <img
                            src="https://file.rendit.io/n/dOy2mjmsE2T3yVhZafgL.svg"
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

export default function CollateralValue(props: CollateralValueProps) {
    return (
        <>
            <div className="text-sm font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Collateral value
            </div>

            {props.data ? <Collateral /> : <NoCollateral />}
        </>
    )
}
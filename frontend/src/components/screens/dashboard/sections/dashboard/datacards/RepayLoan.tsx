import { Input } from "@/components/ui/input"

function NoActiveLoan() {
    return (
        <>
            <div className="flex flex-col ml-10 pb-4 gap-2 w-2/3 h-full justify-center items-start">
                <img
                    src="https://file.rendit.io/n/gVsSrOhjLVEtIETl69tM.svg"
                    alt="Vuesaxboldemojihappy"
                    id="Vuesaxboldemojihappy"
                    className="ml-16 w-16"
                />
                <div className="flex flex-col gap-1 w-full font-['Inter'] items-start">
                    <div className="text-center text-sm font-medium leading-[24px] text-[#a1a1aa] ml-10">
                        No active loans
                    </div>
                    <div className="text-center text-xs font-medium leading-[16px] text-[#52525b] w-full">
                        No worries! You have no active loan to repay at this time
                    </div>
                </div>
            </div>
        </>
    )
}

function ActiveLoan() {
    return (
        <>
            <div className="mt-4 relative flex flex-row w-full items-start">
                <div className="h-10 bg-[#5b21b6] absolute top-12 left-2 rounded" />
                <div className="items-start bg-[#6d28d9] relative flex flex-col justify-center mb-1 pl-16 gap-1 w-full h-20 font-['Inter'] rounded-lg">
                    <div className="text-center text-sm font-medium leading-[24px] text-white ml-4">
                        Due amount
                    </div>
                    <div className="text-center text-xl font-semibold tracking-[-0.1] leading-[28px] text-white">
                        13 702 GHO
                    </div>
                </div>
            </div>
            <div className="mt-4 flex flex-col justify-between ml-1 gap-2 w-full font-['Inter'] items-start">
                <div
                    id="Repay Field"
                    className="bg-[#27272a] flex flex-row  w-full rounded h-full"
                >
                    <Input type="number" placeholder="Repay" className="rounded-l" />

                    <div
                        id="NavigationMenuItem"
                        className="bg-[#3f3f46] flex flex-row items-center  pl-4 pr-4 w-max rounded-r"
                    >
                        <div
                            className="h-full text-sm font-medium leading-[20px] text-white"
                        >
                            GHO
                        </div>
                        <img
                            src="https://file.rendit.io/n/9aTLl3UQ4JolaLcdMKOj.svg"
                            alt="Iconchevrondown"
                            id="Iconchevrondown"
                        />
                    </div>
                </div>
                <button className="mt-4 bg-[#27272a] flex flex-row ml-[111px] w-8 h-8 items-start pt-2 px-2 rounded">
                    <img
                        src="https://file.rendit.io/n/dHCZPsO70i92T5G5YJjh.svg"
                        alt="Iconarrowupdown"
                        id="Iconarrowupdown"
                        className="w-4"
                    />
                </button>
                <div
                    id="Field1"
                    className="mt-4 bg-[#27272a] flex flex-row justify-end gap-16 w-full font-['Inter'] items-start rounded"
                >
                    <div className="text-sm leading-[24px] text-[#a1a1aa] mt-1">
                        Amount in GHO
                    </div>
                    <div
                        id="NavigationMenuItem1"
                        className="text-sm font-medium leading-[20px] text-white bg-[#27272a] flex flex-row justify-center mb-px pt-2 w-16 h-8 items-start rounded"
                    >
                        GHO
                    </div>
                </div>
            </div>
            <button
                id="Button1"
                className="mt-4 text-sm font-medium leading-[24px] text-white bg-[#6d28d9] flex flex-row justify-center ml-1 pt-2 w-full h-10 cursor-pointer items-start rounded"
            >
                Repay loan
            </button>
            <div className="mt-4 text-xs font-medium leading-[16px] text-[#71717a] ml-1 w-full font-['Inter']">
                Repaying your loan amount before the due date enables you to reclaim your
                NFT before it is sold. Learn more in our{" "}
                <a href="https://savvydefi.io/privacy-policy/" target="_blank"
                    className="text-white">due date policy</a>
                .
            </div>
        </>
    )
}

interface RepayLoanProps {
    data: {}
}
export default function RepayLoan(props: RepayLoanProps) {
    return (
        <>
            <div className="text-sm font-medium leading-[24px] text-[#a1a1aa] ml-1">
                Repay loan
            </div>
            {props.data ? <ActiveLoan /> : <NoActiveLoan />}
        </>
    )
}
import { DropDownSelect } from "@/components/ui/dashboard/DropDownSelect"
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
                <div className=" bg-[#6d28d9] flex flex-col justify-center items-center mb-1 w-full h-20 font-['Inter'] rounded-lg">
                    <div className="text-sm font-medium leading-[24px] text-white">
                        Due amount
                    </div>
                    <div className="text-xl font-semibold tracking-[-0.1] leading-[28px] text-white">
                        13 702 GHO
                    </div>
                </div>
            </div >
            <div className="mt-4 flex flex-col justify-between ml-1 gap-2 w-full font-['Inter'] items-center">
                <div
                    id="Repay Field"
                    className="bg-[#27272a] flex flex-row  w-full rounded h-full"
                >
                    <Input type="number" placeholder="Repay" className="rounded-l" />

                    <DropDownSelect values={["GHO", "ETH"]} onValueChange={(value) => console.log(value)} />

                </div>
                <button className="mt-2 mb-2 bg-[#27272a] flex flex-row w-8 h-8 items-center justify-center rounded">
                    <img
                        src="https://file.rendit.io/n/dHCZPsO70i92T5G5YJjh.svg"
                        alt="Iconarrowupdown"
                        id="Iconarrowupdown"
                        className="w-4"
                    />
                </button>
                <div
                    id="Field1"
                    className=" bg-[#27272a] flex flex-row items-center gap-1 h-8 w-full font-['Inter'] rounded"
                >
                    <div className="pl-4 text-sm w-5/6 leading-[24px] text-[#a1a1aa] ">
                        Amount in GHO
                    </div>
                    <div
                        id="NavigationMenuItem1"
                        className="text-sm font-medium leading-[20px] text-white bg-[#27272a] flex flex-row justify-center items-center w-1/6 rounded"
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
    data?: {}
}
export default function RepayLoan(props: RepayLoanProps) {
    return (
        <div className="flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center" style={{ maxWidth: "500px" }}>
                <div className="text-sm font-medium leading-[24px] text-[#a1a1aa] ml-1">
                    Repay loan
                </div>
                {props.data ? <ActiveLoan /> : <NoActiveLoan />}
            </div>
        </div >
    )
}
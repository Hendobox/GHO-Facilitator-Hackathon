import { DropDownSelect } from "@/components/ui/dashboard/DropDownSelect"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { repayDebt } from "@/contract/loanHandler"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

function NoActiveLoan() {
    return (
        <>
            <div className="flex flex-col pb-4 gap-2 w-2/3 h-96 justify-center items-center">
                <img
                    src="https://file.rendit.io/n/gVsSrOhjLVEtIETl69tM.svg"
                    alt="Vuesaxboldemojihappy"
                    id="Vuesaxboldemojihappy"
                    className=" w-16"
                />
                <div className="pt-4 flex flex-col gap-1 w-full font-['Inter'] items-center">
                    <div className="text-center text-sm font-medium leading-[24px] text-[#a1a1aa]">
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

function ActiveLoan({ balance,
    loanId }: RepayLoanProps) {

    const account = useAccount()
    const [amount, setAmount] = useState(0)

    async function repayLoan() {
        const chain = await account.connector?.getChainId()

        if (amount <= 0) {
            toast({
                title: "Invalid amount",
                description: `please set valid amount`,
                variant: "ghost"
            });
        }

        // if (loanId && balance && BigInt(balance) >= BigInt(0)) {
        else {
            const hash = await repayDebt(
                account,
                { id: chain },
                {
                    loanId: BigInt(loanId ?? 0),
                    amount: BigInt(amount * (10 ** 6))
                }
            )

            toast({
                title: "Transaction Hash",
                description: `${hash}%`,
                variant: "ghost"
            });
        }
    }

    useEffect(() => {
        console.log("repay " + balance)
    })

    return (
        <>
            <div className="mt-4 relative flex flex-row w-full items-start">
                <div className="h-10 bg-[#5b21b6] absolute top-12 left-2 rounded" />
                <div className=" bg-[#6d28d9] flex flex-col justify-center items-center mb-1 w-full h-20 font-['Inter'] rounded-lg">
                    <div className="text-sm font-medium leading-[24px] text-white">
                        Due amount
                    </div>
                    <div className="text-xl font-semibold tracking-[-0.1] leading-[28px] text-white">
                        {
                            parseFloat((balance)?.toString() ?? "0") / (10 ** 6)
                        }
                    </div>
                </div>
            </div >
            <div className="mt-4 flex flex-col justify-between ml-1 gap-2 w-full font-['Inter'] items-center">
                <div
                    id="Repay Field"
                    className="bg-[#27272a] flex flex-row  w-full rounded h-full"
                >
                    <Input type="number" placeholder="Repay" className="rounded-l"
                        onChange={(e) => { setAmount(parseFloat(e.target.value)) }} />

                    <DropDownSelect values={["GHO", "USDC"]} onValueChange={(value) => console.log(value)} />

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
                    <Input disabled placeholder="Amount in GHO"
                        value={amount === 0 || !amount ? "Amount in GHO" : amount}
                        className="pl-4 text-sm w-5/6 leading-[24px] text-[#a1a1aa] " />
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
                onClick={repayLoan}
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
    balance?: bigint,
    loanId?: number,
    noLoans?: boolean
}
export default function RepayLoan(props: RepayLoanProps) {
    return (
        <div className="flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center" style={{ maxWidth: "500px" }}>
                <div className="text-sm font-medium leading-[24px] text-[#a1a1aa]">
                    Repay loan
                </div>
                {props.noLoans ? <NoActiveLoan /> :
                    <ActiveLoan balance={props.balance} loanId={props.loanId} />}
            </div>
        </div >
    )
}
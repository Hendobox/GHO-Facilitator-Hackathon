import { Button } from "@/components/ui/button"

export default function RepayKeepStake() {
    const loanAmount: number = 7412;
    return (
        <div className="h-full flex flex-col justify-between" >
            <div className="text-sm font-medium mb-4">
                Repay and keep stake
            </div>

            <div className="text-sm font-extralight mb-6">
                Repay your loan while retaining your staked asset for continued earnings
            </div>

            <div className="" >
                <div className="text-zinc-400 text-sm font-extralight" >
                    Loan amount
                </div>
                <div className="mt-2 text-3xl font-bold">
                    {loanAmount.toLocaleString('en-IN')} GHO
                </div>
            </div >

            <Button variant={"outline"} className="
             w-full mt-9 rounded-md bg-zinc-900 ">
                <div className="text-sm font-medium font-['Inter'] leading-normal">
                    Repay and keep stake
                </div>
            </Button>

        </div >
    )
}
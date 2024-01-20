import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function StakeBuffer() {
    return (
        <div className="h-full flex flex-col justify-between" >
            <div className="text-sm font-medium mb-4">
                Stake additional buffer
            </div>

            <div className="text-sm font-extralight mb-4">
                Reduce your interest by staking more of your collateral buffer
            </div>

            <div className=" flex-col justify-start items-start" >
                <div className="self-stretch justify-start items-center gap-3 inline-flex">

                    <div className="pt-3 pb-3 pl-2 pr-2 bg-zinc-800 rounded justify-center items-center ">
                        <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 1L6 12L1 7" stroke="#22C55E" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div className=" text-zinc-400 text-xs font-medium">
                        Receive yields on the total value of your asset
                    </div>
                </div>

                <div className="h-4" />

                <div className="self-stretch justify-start items-center gap-3 inline-flex">

                    <div className="pt-3 pb-3 pl-2 pr-2 bg-zinc-800 rounded justify-center items-center ">
                        <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 1L6 12L1 7" stroke="#22C55E" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div className=" text-zinc-400 text-xs font-medium">
                        Access interest-based loans on your asset. Take out anyhow you want
                    </div>
                </div>
            </div >

            <Link to={"/borrow/stake"}>
                <Button variant={"simple"} className="
             w-full mt-6 bg-violet-700 rounded-md ">
                    <div className="text-sm font-medium font-['Inter'] leading-normal">
                        Stake buffer
                    </div>
                </Button>
            </Link>

        </div >
    )
}
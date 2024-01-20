import CustomInput from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { DropDownSelect } from "@/components/ui/dashboard/DropDownSelect";
import { useState } from "react";

export default function StakeAccordionCard() {

    const [amount, setAmount] = useState("");
    const maxAmount = "10.0"

    return (
        <div className="mt-2 flex flex-row justify-between w-full font-['Inter'] items-end">
            <div className="flex flex-col gap-1 w-1/4 items-start">
                <CustomInput
                    label="Amount"
                    value={amount}
                    onChange={setAmount}
                    type="number"
                    placeholder="0.0"
                    actionElement={
                        <Button
                            variant="simple"
                            className="h-full text-[#D97706]"
                            onClick={() => setAmount(`${maxAmount}`)}
                        >
                            MAX
                        </Button>
                    }
                />
            </div>
            <div className="flex flex-col gap-1 w-1/4 font-['Inter'] justify-end items-center">
                <div className="text-sm font-medium leading-[20px] text-white w-full ml-1">
                    Duration
                </div>
                <DropDownSelect
                    color="#27272A"
                    className="h-10"
                    values={["30 days", "45 days", "60 days"]}
                    onValueChange={(value) => console.log(value)}
                />
            </div>
            <div className="flex flex-col gap-1 w-1/4 font-['Inter'] items-start">
                <div className="text-sm font-medium leading-[20px] text-white">
                    Expected earning
                </div>
                <div
                    id="Field2"
                    className="bg-[#27272a] flex flex-row justify-between w-full h-10 items-start pt-2 px-4 rounded"
                >
                    <div className="text-sm leading-[24px] text-white">0</div>
                    <div className="text-sm leading-[24px] text-[#a1a1aa]">4% APY</div>
                </div>
            </div>
            <button
                id="Button1"
                className="text-sm font-medium leading-[24px] text-white bg-[#6d28d9] flex flex-row justify-center mt-6 pt-2 w-24 h-10 cursor-pointer items-start rounded"
            >
                Stake
            </button>
        </div>

    )
}
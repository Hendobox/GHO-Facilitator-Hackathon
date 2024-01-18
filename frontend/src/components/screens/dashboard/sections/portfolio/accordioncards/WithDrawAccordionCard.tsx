import CustomInput from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { DropDownSelect } from "@/components/ui/dashboard/DropDownSelect";
import { useState } from "react";

export default function WithdrawAccordionCard() {

    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("")
    const maxAmount = "10.0"

    return (
        <div className="mt-2 flex flex-row justify-between w-full font-['Inter'] items-start">
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
            <div className="flex flex-col gap-1 w-1/4 items-start">
                <CustomInput
                    label="Address"
                    value={address}
                    onChange={setAddress}
                    className="pln-4"
                    placeholder="Paste or select address"
                // actionElement={
                //     <Button
                //         variant="simple"
                //         className="h-full text-[#D97706]"
                //         onClick={() => setAmount(`${maxAmount}`)}
                //     >
                //         MAX
                //     </Button>
                // }
                />
            </div>
            <div className="flex flex-col gap-1 w-1/4 font-['Inter'] justify-end items-center">
                <div className="text-sm font-medium leading-[20px] text-white w-full ml-1">
                    Select network
                </div>
                <DropDownSelect
                    color="#27272A"
                    className="h-10"
                    values={["Ethereum", "Arbitrum", "Polygon"]}
                    onValueChange={(value) => console.log(value)}
                />
            </div>
            <button
                id="Button1"
                className="text-sm font-medium leading-[24px] text-white bg-[#6d28d9] flex flex-row justify-center mt-6 pt-2 w-24 h-10 cursor-pointer items-start rounded"
            >
                Withdraw
            </button>
        </div>
    )
}
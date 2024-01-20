import CustomInput, { Icon } from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from 'react';
import { ProductType } from "../../Borrow";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type NetworkType = 'ETH' | 'BSC';
const Durations: Record<string, string> = {
    "7": "1 week",
    "14": "2 weeks",
    "30": "1 month",
    "60": "2 months",
    "90": "3 months",
    "180": "6 months",
    "365": "1 year",
    "730": "2 years",
    "1095": "3 years",
}

const LoanTerms = ({
    chosenProduct,
    setProductType
}: {
    chosenProduct: ProductType,
    setProductType: (product: ProductType) => void
}) => {
    const [amount, setAmount] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [network, setNetwork] = useState<NetworkType>('ETH');
    const [interestRate, setInterestRate] = useState<number>(0);
    // use toast when rate updates
    const { toast } = useToast();
    const loanAmount = +amount;
    const interest = interestRate;
    const dueDate = "03/28/2024";
    const dueAmount = loanAmount + interest;
    const interestPct = `${(interest / loanAmount) * 100}%`;
    const apy = 204;

    const maxAmount = 1000;
    console.log("🚀 ~ LoanTerms ~ network:", network)

    useEffect(() => {
        if (+amount < 0) return;
        const interestRate = +amount * Math.random();
        setInterestRate(interestRate);
    }, [amount]);

    return (
        <div className="flex flex-row justify-between gap-10">
            <div className="flex flex-col w-1/2 gap-10">
                <div className="flex flex-row justify-between items-center">
                    <span>Enter {chosenProduct === "borrow" ? "loan" : "stake"} details</span>
                    {chosenProduct !== "stake" && (
                        <div className="flex items-center gap-2">
                            <span>Stake buffer</span>
                            <Icon icon="document" />
                            <Switch
                                checked={chosenProduct === "stake_borrow"}
                                onCheckedChange={(value) => {
                                    setProductType(value ? "stake_borrow" : "borrow");
                                }}
                            />
                        </div>
                    )}
                </div>
                {chosenProduct !== "stake" &&
                    <div className="flex flex-row justify-between gap-6">
                        <CustomInput
                            label="Loan amount in GHO"
                            value={amount}
                            onChange={setAmount}
                            placeholder="0.0"
                            subtext="Amount cannot exceed xx.yy GHO"
                            icon="document"
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
                        <CustomInput
                            label="Enter loan receiver address"
                            value={address}
                            onChange={setAddress}
                            placeholder="Address"
                            icon="document"
                            actionElement={
                                <Select
                                    onValueChange={(e: NetworkType) => {
                                        setNetwork(e);
                                    }}
                                >
                                    <SelectTrigger className="h-full border-none bg-zinc-700">
                                        <SelectValue placeholder="Network" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-700 text-white border-none">
                                        <SelectItem className="text-zinc-200 focus:bg-zinc-500 focus:text-white" value="ETH">ETH</SelectItem>
                                        <SelectItem className="text-zinc-200 focus:bg-zinc-500 focus:text-white" value="BSC">BSC</SelectItem>
                                    </SelectContent>
                                </Select>

                            }
                        />
                    </div>
                }
                {chosenProduct !== "borrow" &&
                    <CustomInput
                        label={chosenProduct === "stake" ? "Staking duration" : "Buffer stake"}
                        value={duration}
                        onChange={setDuration}
                        placeholder="365 (days)"
                        icon="document"
                        actionElement={
                            <Select
                                onValueChange={(e: string) => {
                                    setDuration(e);
                                    toast({
                                        title: "Interest rate updated",
                                        description: `Interest rate updated to ${interestRate}%`,
                                    });
                                }}
                            >
                                <SelectTrigger className="h-full border-none bg-zinc-700">
                                    <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-700 text-white border-none">
                                    {Object.keys(Durations).map((key) => (
                                        <SelectItem className="text-zinc-200 focus:bg-zinc-500 focus:text-white" value={key}>{Durations[key]}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                        }
                    />
                }
            </div>
            <div className="flex flex-col gap-2 w-1/2">
                {chosenProduct !== "stake" &&
                    <Accordion defaultValue="item-1" type="single" className="px-6 border-[1px] rounded-[8px] border-zinc-700">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Loan Information</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-row justify-between mt-2">
                                    <div className="flex flex-col justify-between gap-2">
                                        <span className="text-sm text-zinc-400">Loan amount</span>
                                        <span>{loanAmount} GHO</span>
                                    </div>
                                    <div className="flex flex-col justify-between gap-2">
                                        <span className="text-sm text-zinc-400">Interest {interestPct}</span>
                                        <span>{interest} GHO</span>
                                    </div>
                                    <div className="flex flex-col justify-between gap-2">
                                        <span className="text-sm text-zinc-400">Due date</span>
                                        <span>{dueDate}</span>
                                    </div>
                                    <div className="flex flex-col justify-between gap-2">
                                        <span className="text-sm text-zinc-400">Due amount</span>
                                        <span>{dueAmount} GHO</span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                }
                {chosenProduct !== "borrow" &&
                    <Accordion defaultValue="item-2" type="single" className="px-6 border-[1px] rounded-[8px] border-zinc-700">
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Stake Information</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-row justify-between mt-2">
                                    <div className="flex flex-col justify-between gap-2">
                                        <span className="text-sm text-zinc-400">Duration</span>
                                        <span>{duration} days</span>
                                    </div>
                                    <div className="flex flex-col justify-between gap-2">
                                        <span className="text-sm text-zinc-400">APY (3.4%)</span>
                                        <span>{apy} GHO</span>
                                    </div>
                                    <div className="flex flex-col justify-between gap-2">
                                        <span className="text-sm text-zinc-400">Total earnings</span>
                                        <span>324,342 GHO</span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                }
            </div>
        </div >
    );
};

export default LoanTerms;

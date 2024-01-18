import CustomInput, { Icon } from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"

type NetworkType = 'ETH' | 'BSC';

const LoanTerms = () => {
    const [amount, setAmount] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);
    const [network, setNetwork] = useState<NetworkType>('ETH');
    const [interestRate, setInterestRate] = useState<number>();
    const { toast } = useToast();

    const maxAmount = 1000;
    console.log("🚀 ~ LoanTerms ~ network:", network)

    useEffect(() => {
        if (+amount < 0) return;
        const interestRate = +amount * Math.random();
        setInterestRate(interestRate);
    }, [amount]);

    return (
        <div className="flex flex-col gap-10">
            <div>
                <span>Borrowing terms</span>
                <div className="mt-5 flex flex-row justify-between gap-6">
                    <CustomInput
                        label="Enter an amount in GHO"
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
                    <CustomInput
                        label="Interest rate"
                        value={interestRate ? `${interestRate.toFixed(2)}%` : ''}
                        readOnly
                        placeholder="Enter amount to see rate"
                        icon="document"
                    />
                </div>
            </div>
            <div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2">
                        <span>Select facilitator</span>
                        <Icon icon="document" />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <motion.span
                            initial={{ opacity: checked ? 1 : 0.5 }}
                            animate={{ opacity: checked ? 0.5 : 1, scale: checked ? 0.95 : 1.05 }}
                            transition={{ duration: 0.3, type: "spring" }}
                        >
                            Lenders
                        </motion.span>
                        <Switch
                            checked={checked}
                            onCheckedChange={(value) => {
                                console.log("🚀 ~ LoanTerms ~ value:", value)
                                setChecked(value);
                                toast({
                                    title: "Interest rate changed!",
                                    description: `New interest rates apply by changing to the ${value ? 'AaveV3' : 'Lenders'} facilitator.`,
                                    variant: "ghost"
                                });
                            }
                            }
                        />
                        <motion.span
                            initial={{ opacity: checked ? 0.5 : 1 }}
                            animate={{ opacity: checked ? 1 : 0.5, scale: checked ? 1.05 : 0.95 }}

                            transition={{ duration: 0.3, type: "spring" }}
                        >
                            AaveV3
                        </motion.span>
                    </div>
                </div>
                <div className="mt-5 flex flex-row justify-between gap-6">
                    <div
                        className={cn("w-1/2 p-6 text-zinc-400 bg-zinc-800 flex flex-col gap-2 rounded-[8px] border-2 border-transparent", { "border-violet-700": !checked })}
                    >
                        <span className="text-sm text-white">Lender</span>
                        <span>
                            Stake your collateral buffer on Savvy Defi and earn interest, enhancing your overall returns
                        </span>
                        <span>
                            Leverage the power of your staked collateral buffer to enjoy reduced interest rates on your loan, maximizing your cost savings.
                        </span>
                    </div>
                    <div
                        className={cn("w-1/2 p-6 text-zinc-400 bg-zinc-800 flex flex-col gap-2 rounded-[8px] border-2 border-transparent", { "border-violet-700": checked })}
                    >
                        <span className="text-sm text-white">AaveV3</span>
                        <span>
                            Utilize the Aave facilitator to borrow without staking your collateral buffer. Enjoy the flexibility of withdrawing the remainder at any time, providing you with instant access to the full value of your collateral.
                        </span>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LoanTerms;

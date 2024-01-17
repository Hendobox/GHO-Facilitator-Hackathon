import CustomInput from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from 'react';

type NetworkType = 'ETH' | 'BSC';

const LoanTerms = () => {
    const [amount, setAmount] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [network, setNetwork] = useState<NetworkType>('ETH');
    const [interestRate, setInterestRate] = useState<number>();
    
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
                    <span>Receiver:</span>
                    <div>
                        <Switch />
                        <span>Same as borrower</span>
                    </div>
                </div>
                <CustomInput
                    label="Enter an amount in GHO"
                    value={amount}
                    onChange={setAmount}
                    placeholder="0.0"
                    subtext="Amount cannot exceed xx.yy GHO"
                    icon="document"
                />
            </div>
        </div >
    );
};

export default LoanTerms;

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { InterfaceNFT } from "../depositNFT/columns";
import { ProductType } from "../../Borrow";


interface LoanSummaryProps {
    chosenProduct: ProductType;
    selectedNFTs: InterfaceNFT[];
    receiverAddress: string;
    loanAmount: number;
    interest: number;
    dueDate: string;
    dueAmount: number;
    buffer: number;
    apy: number;
    stakingPeriod: number;
    interestSaved: number;
}

const LoanSummary: React.FC<LoanSummaryProps> = ({
    chosenProduct,
    selectedNFTs,
    receiverAddress,
    loanAmount,
    interest,
    dueDate,
    dueAmount,
    buffer,
    apy,
    stakingPeriod,
    interestSaved,
}) => {
    const nft = selectedNFTs[0];
    return (
        <div className="flex flex-row gap-10">
            <div className="flex flex-col gap-6">
                <img className="rounded-[8px]" src={nft.imageUrl} alt={nft.description} />
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm text-zinc-400">Asset</span>
                        <span>{nft.description}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-zinc-400">Floor price</span>
                        <span>{nft.price} WETH</span>
                    </div>
                </div>
                <span className="text-sm">{receiverAddress}</span>
            </div>
            <div className="flex flex-col w-full gap-6">
                <div className="flex flex-col gap-3">
                    <div className="">Loan summary</div>
                    <span className="mt-5 text-sm text-zinc-400">Receiver address</span>
                    <span>{receiverAddress}</span>
                </div>
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
                                    <span className="text-sm text-zinc-400">Interest (5.4%)</span>
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
                <Accordion defaultValue="item-2" type="single" className="px-6 border-[1px] rounded-[8px] border-zinc-700">
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Stake Information</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-row justify-between mt-2">
                                <div className="flex flex-col justify-between gap-2">
                                    <span className="text-sm text-zinc-400">Buffer</span>
                                    <span>{buffer} GHO</span>
                                </div>
                                <div className="flex flex-col justify-between gap-2">
                                    <span className="text-sm text-zinc-400">APY (3.4%)</span>
                                    <span>{apy} GHO</span>
                                </div>
                                <div className="flex flex-col justify-between gap-2">
                                    <span className="text-sm text-zinc-400">Staking period</span>
                                    <span>{stakingPeriod} days</span>
                                </div>
                                <div className="flex flex-col justify-between gap-2">
                                    <span className="text-sm text-zinc-400">Interest saved</span>
                                    <span>{interestSaved}%</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div >
    );
};

export default LoanSummary;
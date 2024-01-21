import { useState } from "react"
import BorrowHeader from "../../ui/borrow/BorrowHeader"
import { borrowSteps } from "@/constants/borrowSteps"
import NavigationButtons from "../../ui/borrow/NavigationButtons"
import DepositNFT from "./steps/depositNFT/DepositNFT"
import { InterfaceNFT } from "./steps/depositNFT/columns"
import LoanTerms from "./steps/loanTerms/LoanTerms"
import GetApproval from "./steps/getApproval/GetApproval"
import ChooseProduct from "./steps/chooseProduct/ChooseProduct"
import { useAccount } from "wagmi"
import { startLoan } from "@/contract/loanHandler"
import { useToast } from "@/components/ui/use-toast"

export type ProductType = "stake" | "borrow" | "stake_borrow"

export default function Borrow() {
    const [step, setStep] = useState(0)
    const [selectedNFTs, setSelectedNFTs] = useState<InterfaceNFT[]>([])
    const [productType, setProductType] = useState<ProductType>("stake")
    const [loanAmount, setLoanAmount] = useState(0)
    const account = useAccount()
    const { toast } = useToast();

    async function submitLoan() {
        const chain = await account.connector?.getChainId()
        const nftData = selectedNFTs[0]

        const facilitator = productType == "borrow" ? 1 : 0; // 0 is native, 1 is aave
        const collateralAddress = nftData.contractAddress || "0x8c427C56790f2C36664870a55B3A0189bFf9996d"
        const collateralId = BigInt(nftData.tokenId || 0)
        const principal = BigInt(loanAmount * (10 ** 18)) // convert decimal to bigint

        const hash = await startLoan(
            account,
            { id: chain },
            {
                collateralAddress: collateralAddress,
                facilitator: facilitator,
                collateralId: collateralId,
                principal: principal
            }
        )

        toast({
            title: "Transaction Hash",
            description: `${hash}%`,
            variant: "ghost"
        });
    }

    const handleNextStep = () => {
        if (step === 2) {
            if (loanAmount <= 0) {
                toast({
                    title: `Loan Amount ${loanAmount} invalid!`,
                    description: `Specify valid loan amount`,
                    variant: "ghost"
                });
                return
            }
        }

        if (step === 0 && selectedNFTs.length === 0) {
            return
        }
        const newStep = step + 1

        if (newStep == borrowSteps.length) {
            if (productType === "borrow") {
                submitLoan()
            }
        }
        if (newStep > borrowSteps.length - 1) {
            return
        }
        setStep(newStep)
    }

    const handlePreviousStep = () => {
        const newStep = step - 1
        if (newStep < 0) {
            return
        }
        setStep(newStep)
    }

    const renderScreen = () => {
        switch (step) {
            case 0:
                return <DepositNFT setSelectedNFTs={setSelectedNFTs} />
            case 1:
                return <ChooseProduct chosenProduct={productType} onChooseProduct={(product: ProductType) => {
                    setProductType(product)
                    handleNextStep()
                }} />
            case 2:
                return <LoanTerms
                    chosenProduct={productType}
                    setProductType={setProductType}
                    setLoanAmount={setLoanAmount}
                />
            case 3:
                return <GetApproval
                    chosenProduct={productType}
                    selectedNFT={selectedNFTs[0]}
                    receiverAddress={account.address ?? "Connect wallet"}
                    loanAmount={loanAmount} // 13000
                    interest={702}
                    dueDate="03/28/2024"
                    dueAmount={13702}
                    buffer={6000}
                    apy={204}
                    stakingPeriod={45}
                    interestSaved={2.1}
                />
            default:
                return null
        }
    }

    return (
        <div className="min-h-[calc(85vh-105px)] pb-10 flex flex-col justify-start text-white px-28 border-t-[1px] border-[#3F3F46]">
            <div>
                <BorrowHeader step={step} productType={productType} />
                {renderScreen()}
            </div>
            <NavigationButtons handlePreviousStep={handlePreviousStep} handleNextStep={handleNextStep} noNextButton={step === 1} />
        </div>
    )
}
import { useState } from "react"
import BorrowHeader from "../../ui/borrow/BorrowHeader"
import { borrowSteps } from "@/constants/borrowSteps"
import NavigationButtons from "../../ui/borrow/NavigationButtons"
import DepositNFT from "./steps/depositNFT/DepositNFT"
import { InterfaceNFT } from "./steps/depositNFT/columns"
import LoanTerms from "./steps/loanTerms/LoanTerms"
import GetApproval from "./steps/getApproval/GetApproval"
import ChooseProduct from "./steps/chooseProduct/ChooseProduct"

export type ProductType = "stake" | "borrow" | "stake_borrow"

export default function Borrow() {
    const [step, setStep] = useState(0)
    const [selectedNFTs, setSelectedNFTs] = useState<InterfaceNFT[]>([])
    const [productType, setProductType] = useState<ProductType>("stake")

    const handleNextStep = () => {
        if (step === 0 && selectedNFTs.length === 0) {
            return
        }
        const newStep = step + 1
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
                return <LoanTerms chosenProduct={productType} setProductType={setProductType} />
            case 3:
                return <GetApproval
                    chosenProduct={productType}
                    selectedNFTs={selectedNFTs}
                    receiverAddress="0xC0ffee254729296...AC7E10F9d54979"
                    loanAmount={13000}
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
        <div className="h-[calc(85vh-105px)] flex flex-col justify-start text-white px-28 border-t-[1px] border-[#3F3F46]">
            <div>
                <BorrowHeader step={step} productType={productType} />
                {renderScreen()}
            </div>
            <NavigationButtons handlePreviousStep={handlePreviousStep} handleNextStep={handleNextStep} noNextButton={step === 1} />
        </div>
    )
}
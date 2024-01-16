import { useState } from "react"
import BorrowHeader from "../../ui/borrow/BorrowHeader"
import { borrowSteps } from "@/constants/borrowSteps"
import NavigationButtons from "../../ui/borrow/NavigationButtons"
import DepositNFT from "./steps/depositNFT/DepositNFT"
import { InterfaceNFT } from "./steps/depositNFT/columns"

export default function Borrow() {
    const [step, setStep] = useState(0)
    const [selectedNFTs, setSelectedNFTs] = useState<InterfaceNFT[]>([])

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
            default:
                return null
        }
    }

    return (
        <div className="h-[calc(90vh-104px)] flex flex-col justify-between text-white mx-28 border-t-[1px] border-[#3F3F46]">
            <BorrowHeader step={step} />
            {renderScreen()}
            <NavigationButtons handlePreviousStep={handlePreviousStep} handleNextStep={handleNextStep} />
        </div>
    )
}
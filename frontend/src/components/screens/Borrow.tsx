import { useState } from "react"
import BorrowHeader from "../ui/borrow/BorrowHeader"
import { borrowSteps } from "@/constants/borrowSteps"
import NavigationButtons from "../ui/borrow/NavigationButtons"

export default function Borrow() {
    const [step, setStep] = useState(0)

    const handleNextStep = () => {
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

    return (
        <div className="h-[calc(90vh-104px)] flex flex-col justify-between text-white mx-28 border-t-[1px] border-[#3F3F46]">
            <BorrowHeader step={step} />
            <span>Borrow</span>
            <NavigationButtons handlePreviousStep={handlePreviousStep} handleNextStep={handleNextStep} />
        </div>
    )
}
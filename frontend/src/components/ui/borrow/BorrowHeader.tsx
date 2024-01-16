import { borrowSteps } from "@/constants/borrowSteps"
import StepIndicator from "./StepIndicator"


export default function BorrowHeader({ step }: { step: number }) {
    const {
        title,
        subtitle,
    } = borrowSteps[step]

    return (
        <div className="flex flex-row justify-between pt-8 items-start text-white">
            <div className="flex flex-col">
                <h1 className="text-3xl font-semibold">{title}</h1>
                <span className="text-sm text-zinc-400 font-normal">{subtitle}</span>
            </div>
            <div className="w-1/3">
                <StepIndicator currentStep={step} totalSteps={borrowSteps.length} />
            </div>
        </div>
    )
}
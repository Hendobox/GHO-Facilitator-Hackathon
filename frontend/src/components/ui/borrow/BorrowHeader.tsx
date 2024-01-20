import { borrowSteps } from "@/constants/borrowSteps"
import StepIndicator from "./StepIndicator"
import { ProductType } from "@/components/screens/borrow/Borrow"
import { products } from "@/components/screens/borrow/steps/chooseProduct/products"


export default function BorrowHeader({ step, productType }: { step: number, productType: ProductType }) {
    const title = step === 2 ? products.find(product => product.type === productType)?.name : borrowSteps[step].title
    const subtitle = step === 2 ? "You’ve added the following assets as collateral. Confirm terms and proceed" : borrowSteps[step].subtitle

    return (
        <div className="mb-10 flex flex-row justify-between pt-8 items-start text-white">
            <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold">{title}</h1>
                <span className="text-sm text-zinc-400 font-normal">{subtitle}</span>
            </div>
            <div className="w-1/3">
                <StepIndicator currentStep={step} totalSteps={borrowSteps.length} />
            </div>
        </div>
    )
}
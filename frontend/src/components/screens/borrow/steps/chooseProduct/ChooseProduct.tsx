import { cn } from "@/lib/utils"
import { ProductType } from "../../Borrow"
import { motion } from "framer-motion"

const products: {
    name: string,
    description: string,
    type: ProductType,
    points: string[]
}[]
    = [
        {
            name: "Stake",
            description: "For active earners, investors and liquidity providers.",
            type: "stake",
            points: ["Receive yields on the total value of your asset", "No loan takeouts. No interest issues"]
        },
        {
            name: "Borrow",
            description: "For active earners, investors and liquidity providers.",
            type: "borrow",
            points: ["Receive yields on the total value of your asset", "Access interest-based loans on your asset. Take out anyhow you want"]
        },
        {
            name: "Stake & Borrow",
            description: "For active earners, investors and liquidity providers.",
            type: "stake_borrow",
            points: ["Low interest rate, when you stake your collateral buffer", "Earn yields for as long as your asset is locked with us"]
        }
    ]

export default function ChooseProduct({
    chosenProduct,
    onChooseProduct
}: {
    chosenProduct: ProductType
    onChooseProduct: (product: ProductType) => void
}) {


    return (
        <div className="flex flex-row justify-between gap-6">
            {products.map((product, index) => (
                <div key={index} className="w-1/3 flex flex-col justify-between gap-4 p-10 bg-zinc-800 text-white rounded-[8px]">
                    <h2 className="text-3xl font-semibold">{product.name}</h2>
                    <span>{product.description}</span>
                    <div className="flex flex-col gap-4">
                        {product.points.map((point, key) => (
                            <div key={key} className="flex flex-row justify-start items-center gap-3">
                                <svg className="min-w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17L4 12" stroke="#22C55E" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>{point}</span>
                            </div>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn("border-[1px] w-full border-violet-700 hover:bg-violet-700 rounded-md py-2 px-4", { "bg-violet-700": chosenProduct === product.type })}
                        onClick={() => {
                            onChooseProduct(product.type)
                        }}
                    >
                        {product.name} {product.type === "stake" && "now"}
                    </motion.button>
                </div>
            ))
            }

        </div >
    )
}
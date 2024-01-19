import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ProductType } from "../../Borrow"
import { products } from "./products"
import { useState } from "react"

export type FacilitatorType = "unHODL" | "AaveV3";

export default function ChooseProduct({
    chosenProduct,
    onChooseProduct
}: {
    chosenProduct: ProductType
    onChooseProduct: (product: ProductType) => void
}) {
    const [activeTab, setActiveTab] = useState<FacilitatorType>("unHODL")
    return (
        <div className="flex flex-col items-center w-full gap-11">
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as FacilitatorType)}>
                <TabsList className="h-[60px] w-[260px]">
                    <TabsTrigger className="flex-1 h-full" value="unHODL">unHODL</TabsTrigger>
                    <TabsTrigger className="flex-1 h-full" value="AaveV3">AaveV3</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex flex-row justify-between gap-6">
                {products.map((product, index) => (
                    <div key={index} className={cn("w-1/3 flex flex-col justify-between gap-4 p-10 bg-zinc-800 text-white rounded-[8px]", {
                        "opacity-50": product.facilitator !== activeTab
                    })}>
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
                            whileHover={product.facilitator === activeTab ? { scale: 1.05 } : {}}
                            whileTap={product.facilitator === activeTab ? { scale: 0.95 } : {}}
                            disabled={product.facilitator !== activeTab}
                            className={
                                cn(
                                    "border-[1px] w-full border-violet-700 rounded-md py-2 px-4",
                                    { "bg-violet-700": chosenProduct === product.type },
                                    { "hover:bg-violet-700": product.facilitator === activeTab }
                                )}
                            onClick={() => {
                                if (product.facilitator === activeTab) {
                                    onChooseProduct(product.type)
                                }
                            }}
                        >
                            {product.name} {product.type === "stake" && "now"}
                        </motion.button>
                    </div>
                ))
                }

            </div >
        </div>
    )
}
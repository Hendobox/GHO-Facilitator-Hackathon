import { ProductType } from "../../Borrow"

export const products: {
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
            name: "Borrow and Stake",
            description: "For active earners, investors and liquidity providers.",
            type: "stake_borrow",
            points: ["Low interest rate, when you stake your collateral buffer", "Earn yields for as long as your asset is locked with us"]
        }
    ]
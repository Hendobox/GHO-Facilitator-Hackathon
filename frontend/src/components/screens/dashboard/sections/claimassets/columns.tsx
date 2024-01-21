import { InterfaceNFT } from "@/components/screens/borrow/steps/depositNFT/columns"
import { Button } from "@/components/ui/button"
import Checks from "@/components/ui/icons/checks"
import { ColumnDef } from "@tanstack/react-table"
import { motion } from "framer-motion"

export const columns: ColumnDef<InterfaceNFT>[] = [
    {
        accessorKey: "imageUrl",
        header: "Asset",
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <img
                        className="w-20 h-20 rounded-md"
                        src={row.getValue("imageUrl")}
                        alt=""
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "name",
        header: "Title",
        cell: ({ row }) => {
            return row.getValue("name") || <span className="opacity-50">No title</span>
        }
    },
    {
        accessorKey: "price",
        header: "Floor price",
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    {(parseFloat(row.getValue("price")) / (10 ** 6)).toLocaleString('en-US')} USDC
                </div>
            );
        }
    },
    {
        accessorKey: "balance",
        header: "Loan balance",
        cell: ({ row }) => {
            const balance = BigInt(row.getValue("balance")).toString()
            console.log("Columns " + balance)
            return (
                <div className="flex items-center">
                    {(parseFloat(balance) / (10 ** 18)).toFixed(4)} GHO
                </div>
            );
        }
    },
    {
        id: "select",
        header: "Deposit",
        cell: ({ row }) => {
            return (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        variant={row.getIsSelected() ? "disabled" : "ghost"}
                        onClick={() => row.toggleSelected(!row.getIsSelected())}
                    >
                        {row.getIsSelected() ? <Checks /> : "Unstake"}
                    </Button>
                </motion.div>
            )
        }
    },
]

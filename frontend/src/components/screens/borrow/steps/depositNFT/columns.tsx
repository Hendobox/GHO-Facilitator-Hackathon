import { Checkbox } from "@radix-ui/react-checkbox"
import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
    imageUrl: string
    description: string
    price: number
    link: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
        accessorKey: "description",
        header: "description",
    },
    {
        accessorKey: "price",
        header: "price",
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    {row.getValue("price")} ETH
                </div>
            );
        }
    },
    {
        accessorKey: "link",
        header: "Explore",
        cell: info => <a target="_blank" href={info.getValue() as string}>Go</a>
    },
]

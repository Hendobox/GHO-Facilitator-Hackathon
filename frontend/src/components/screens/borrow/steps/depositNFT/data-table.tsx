import {
    ColumnDef,
    RowSelectionState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    rowSelection: RowSelectionState
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
    noAssetsCount?: boolean
    isLoading?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    rowSelection,
    setRowSelection,
    noAssetsCount,
    isLoading,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        }
    })


    return (
        <>
            <div>
                <Table style={{
                    borderCollapse: "separate",
                    borderSpacing: "0 1em",
                }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <div className="flex flex-row justify-start">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <>
                                {isLoading ? new Array(2).fill(0).map((_, index) => (
                                    <TableRow key={index}>
                                        {new Array(noAssetsCount ? 5 : 4).fill(0).map((_, index) => (
                                            <TableCell key={index} colSpan={columns.length} className="h-20">
                                                <div className="flex flex-row justify-start">
                                                    {flexRender(index === 0 ?
                                                        <Skeleton className="h-20 w-20 rounded-md" />
                                                        : index === 3 ?
                                                            <Skeleton className="h-9 w-14 rounded-sm" />
                                                            : <Skeleton className="h-6 w-[100px] rounded-sm" />, {})}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                                    : (
                                        <TableRow>
                                            No NFTs found
                                        </TableRow>
                                    )
                                }
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>
            {!noAssetsCount && <div className="flex-1 text-sm text-white">
                Assets added: {table.getFilteredSelectedRowModel().rows.length}
            </div>}
        </>
    )
}

import { useCallback, useEffect, useMemo, useState } from "react"
import { InterfaceNFT, columns } from "./columns"
import { DataTable } from "./data-table"
import { RowSelectionState } from "@tanstack/react-table"

function getData(): InterfaceNFT[] {
    return [
        {
            imageUrl: "https://i.seadn.io/s/raw/files/f3564ef33373939b024fb791f21ec37b.png?auto=format&dpr=1&w=1000",
            description: "CryptoPunk #1",
            price: 60,
        },
    ]
}

export default function DepositNFT({
    setSelectedNFTs
}: {
    setSelectedNFTs: React.Dispatch<React.SetStateAction<InterfaceNFT[]>>
}) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const data = useMemo(() => getData(), [])

    const updateSelectedNFTs = useCallback((data: InterfaceNFT[]) => {
        const selectedNFTs = data.filter((_, index) => rowSelection[index])
        setSelectedNFTs(selectedNFTs)
    }, [rowSelection, setSelectedNFTs])

    useEffect(() => {
        updateSelectedNFTs(data)
    }, [data, updateSelectedNFTs])

    return (
        <div className="flex flex-col gap-10">
            <span>Please select your NFT to use as collateral</span>
            <DataTable
                columns={columns}
                data={data}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
            />
        </div>
    )
}

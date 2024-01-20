import { useCallback, useEffect, useMemo, useState } from "react"
import { InterfaceNFT, columns } from "./columns"
import { DataTable } from "./data-table"
import { RowSelectionState } from "@tanstack/react-table"
import { fetchNFTsUser } from "@/contract/nftApi"
import { useAccount } from "wagmi"

function getData(): InterfaceNFT[] {

    const nft1 = {
        balance: 1,
        contractAddress: "0x86ef4d0470dA8A06F21795055a6b8Bf9BA262059",
        description: "1",
        imageUrl: "https://ipfs.io/ipfs/Qmeh7MY7La2FB8yCSo82TUPDamVQJLMH2Ec7qSS5fcqXoH/punk%231.png",
        name: "Crypto Punks",
        tokenId: 0,
        tokenType: "ERC721",
        tokenUri: "https://ipfs.io/ipfs/QmdjvcAD7FvdSZaqrkP62D9cL2npQ3CecvhheMq6Y1S8AT/0",
        price: parseFloat((5398000000 / (10 ** 19)).toString()).toFixed(20),
    }

    return [
        nft1
    ]

    // return [
    //     {
    //         imageUrl: "https://i.seadn.io/s/raw/files/f3564ef33373939b024fb791f21ec37b.png?auto=format&dpr=1&w=1000",
    //         description: "CryptoPunk #1",
    //         price: 60,
    //     },
    // ]
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

    const account = useAccount()

    useEffect(() => {

        (async () => {
            const nfts = fetchNFTsUser(account)
            return nfts
        })().then(nfts => console.log(nfts))

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

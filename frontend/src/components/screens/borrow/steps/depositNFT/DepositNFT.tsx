import { fetchNFTsUser } from "@/contract/nftApi"
import { RowSelectionState } from "@tanstack/react-table"
import { useCallback, useEffect, useState } from "react"
import { PublicClient, useAccount } from "wagmi"
import { GetAccountResult } from "wagmi/actions"
import { InterfaceNFT, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(account: GetAccountResult<PublicClient>): Promise<InterfaceNFT[]> {
    const nfts = await fetchNFTsUser(account)
    return nfts;

    // const nft1 = {
    //     balance: 1,
    //     contractAddress: "0x86ef4d0470dA8A06F21795055a6b8Bf9BA262059",
    //     description: "1",
    //     imageUrl: "https://ipfs.io/ipfs/Qmeh7MY7La2FB8yCSo82TUPDamVQJLMH2Ec7qSS5fcqXoH/punk%231.png",
    //     name: "Crypto Punks",
    //     tokenId: 0,
    //     tokenType: "ERC721",
    //     tokenUri: "https://ipfs.io/ipfs/QmdjvcAD7FvdSZaqrkP62D9cL2npQ3CecvhheMq6Y1S8AT/0",
    //     price: parseFloat((5398000000 / (10 ** 19)).toString()).toFixed(20),
    // }

}

export default function DepositNFT({
    setSelectedNFTs
}: {
    setSelectedNFTs: React.Dispatch<React.SetStateAction<InterfaceNFT[]>>
}) {
    const account = useAccount()
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<InterfaceNFT[]>([])


    useEffect(() => {
        const fetchData = async () => {
            if (account && !data.length) {
                try {
                    const fetchedData = await getData(account)
                    setData(fetchedData)
                    setIsLoading(false)
                } catch (error) {
                    setIsLoading(false)
                }
            }
        }
        fetchData()
    }, [data.length])

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
                isLoading={isLoading}
            />
        </div>
    )
}

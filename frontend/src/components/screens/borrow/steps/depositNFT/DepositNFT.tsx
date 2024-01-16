import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

function getData(): Payment[] {
    return [
        {
            imageUrl: "https://i.seadn.io/s/raw/files/f3564ef33373939b024fb791f21ec37b.png?auto=format&dpr=1&w=1000",
            description: "CryptoPunk #1",
            price: 60,
            link: "https://opensea.io/assets/ethereum/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/1",
        },
    ]
}

export default function DemoPage() {
    const data = getData()

    return (
        <div className="container mx-auto py-10">
            <span>Please select your NFT to use as collateral</span>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

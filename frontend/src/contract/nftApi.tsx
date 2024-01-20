import { PublicClient } from "wagmi";
import { GetAccountResult } from "wagmi/actions";

interface NftData {
    tokenId: number,
    balance: number,
    tokenUri: string, //ipfs
    imageUrl: string, // https
    tokenType: string,
    contractAddress: string,
    name: string,
    description: string
    price: string
}

// Example usage of api
// const account = useAccount()

//     useEffect(() => {
//         if (account) { use my account which has nfts {"address": 0x4A1F47a15831A5f4Cf627414BF57145B0b47de1a}
//             fetchNFTsUser(account).then(
//                 (data) => {
//                     console.log(data)
//                     return data
//                 })
//         }
//     }, [account])

async function fetchNFTsUser(account: GetAccountResult<PublicClient>) {
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    const apiKey = import.meta.env.VITE_ALCHEMY_ID
    const accountAddress = account.address

    const data = await fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${accountAddress}&withMetadata=true&pageSize=100`, options);

    const json = await data.json()
    const nfts = json.ownedNfts

    const nftData: NftData[] = nfts.map((nft: {
        tokenId: string,
        balance: string,
        tokenUri: string,
        image: { cachedUrl: string },
        tokenType: string,
        contract: { address: string, name: string },
        description: string
    }) => ({
        tokenId: parseInt(nft.tokenId),
        balance: parseInt(nft.balance),
        tokenUri: nft.tokenUri,
        imageUrl: nft.image.cachedUrl,
        tokenType: nft.tokenType,
        contractAddress: nft.contract.address,
        name: nft.contract.name,
        description: nft.description,
        price: parseFloat((5398000000 / (10 ** 6)).toString()),
    })
    );

    return nftData;
}

export { fetchNFTsUser };
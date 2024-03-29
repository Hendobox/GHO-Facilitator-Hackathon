import { PublicClient } from "wagmi";
import { GetAccountResult } from "wagmi/actions";
import { getLoans } from "./loanHandler";

interface NftData {
    tokenId: number,
    balance: bigint,
    tokenUri: string, //ipfs
    imageUrl: string, // https
    tokenType: string,
    contractAddress: string,
    name: string,
    description: string
    price: string
    loanId?: number
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
        name: string,
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
        name: nft.name,
        description: nft.description,
        price: parseFloat((Math.random() * (15000 - 5000) + 5000).toFixed(2)),
    })
    );

    return nftData;
}

async function fetchNFTMetadata(contractAddress: `0x${string}`, tokenId: bigint) {

    const options = { method: 'GET', headers: { accept: 'application/json' } }
    const apiKey = import.meta.env.VITE_ALCHEMY_ID

    const data = await fetch(`https://eth-sepolia.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}&refreshCache=false`, options)

    const json = await data.json()
    const nft = json.contract
    const image = json.image

    const nftData: NftData = {
        tokenId: parseInt(nft.tokenId),
        balance: nft.balance,
        tokenUri: nft.tokenUri,
        imageUrl: image.cachedUrl,
        tokenType: nft.tokenType,
        contractAddress: nft.address,
        name: nft.name,
        description: nft.description,
        price: "fetch balance instead of price"
        // price: parseFloat((5398000000 / (10 ** 6)).toString()),
    }

    return nftData;
}

async function getStakeNFTsUser(account: any) {
    const loansData = await getLoans(account);

    const nftsData: NftData[] = [];

    for (let index = 0; index < loansData.length; index++) {
        const loan = loansData[index];
        const nftData = await fetchNFTMetadata(loan.terms.collateralAddress as `0x${string}`, loan.terms.collateralId);

        const mappedNftData: NftData = {
            tokenId: nftData.tokenId,
            balance: loan.balance, // here balance of loan in GHO
            tokenUri: nftData.tokenUri,
            imageUrl: nftData.imageUrl,
            tokenType: nftData.tokenType,
            contractAddress: nftData.contractAddress,
            name: nftData.name, // use this name in ui
            description: nftData.description,
            price: loan.entryPrice.toString(),
            loanId: loan.id
        };

        nftsData.push(mappedNftData);
    }

    return nftsData;
}



export { fetchNFTsUser, fetchNFTMetadata, getStakeNFTsUser };
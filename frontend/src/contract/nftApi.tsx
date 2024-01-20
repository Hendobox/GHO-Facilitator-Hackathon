interface NftData {
    tokenId: number,
    balance: number,
    tokenUri: string, //ipfs
    imgUri: string, // htpps
    tokenType: string,
    contractAddress: string,
    name: string,
    description: string
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

async function fetchNFTsUser(account: any) {
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    const apiKey = import.meta.env.VITE_ALCHEMY_ID
    const accountAddress = account.address

    // change to eth-sepolia for demo
    const data = await fetch(`https://polygon-mumbai.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner?owner=${accountAddress}&withMetadata=true&pageSize=100`, options);

    const json = await data.json()
    const nfts = json.ownedNfts

    const nftData: NftData[] = nfts.map((nft:
        { tokenId: string; balance: any; tokenUri: any; image: { cachedUrl: any; }; tokenType: any; contract: { address: any; name: any; }; description: any; }) => ({
            tokenId: parseInt(nft.tokenId),
            balance: nft.balance,
            tokenUri: nft.tokenUri,
            imgUri: nft.image.cachedUrl,
            tokenType: nft.tokenType,
            contractAddress: nft.contract.address,
            name: nft.contract.name,
            description: nft.description
        }));

    return nftData;
}

export { fetchNFTsUser };

import { WalletClient } from 'wagmi';
import LoanCoreArtifact from './abi/unHODL.json';
import NftArtifact from './abi/NFT.json'
import GhoArtifact from './abi/GhoToken.json'
import { publicActions } from 'viem';
import { LoanData, LoanState, LoanTerms, RepayTerms } from './loanTypes';

const LoanCoreABI = LoanCoreArtifact.abi;
const NftABI = NftArtifact.abi;
const GhoTokenABI = GhoArtifact.abi

const unHODLContractAddress = '0xD7aD2DEf2A84006C7ABbF04794997E206856614f';

async function calculateInterestRate(account: any, loanAmount: bigint) {
    const client = await account.connector?.getWalletClient();

    const interestRate = await publicActions(client).readContract({
        address: unHODLContractAddress,
        abi: LoanCoreABI,
        functionName: 'interestRate',
        account: client.account.address,
        args: [
            loanAmount
        ]
    }) as number;

    return interestRate ?? 10.5
}

// Usage in frontend
//  const account = useAccount(); // get account from conneckit hook, and pass here
// async function testIntegration() {

//     const chain = await account.connector?.getChainId()

//  //   call this for start loan (dummy values)
//     startLoan(account, { id: chain }, {
//         collateralAddress: "0x0273663d8612EE787cC52040699C44E4E55A3751",
//         collateralId: 100000000000000n,
//         principal: 100000000000000n,
//         destinationChainCCIP: 421614, //arbitrum chain id for demo
//         facilitator: 1,
//     });

// // call this for repay debt (dummy values)
//     repayDebt(account, { id: chain }, { loanId: 100n, amount: 100000000000000n });
// }

async function nftApproval(
    account: any,
    chain: any,
    collateralAddress: string,
    collateralId: bigint
) {
    const client: WalletClient = await account.connector?.getWalletClient()

    const nfthash = await client.writeContract(
        {
            address: collateralAddress as `0x${string}`,
            abi: NftABI,
            functionName: 'approve',
            chain: chain,
            account: client.account.address,
            args: [
                unHODLContractAddress,
                collateralId
            ]
        }
    )

    console.log(`NFT approved txn: ${nfthash}`)

    return nfthash
}

async function startLoan(
    account: any,
    chain: any,
    {
        collateralAddress,
        collateralId,
        principal,
        facilitator
    }: LoanTerms,
) {

    const client: WalletClient = await account.connector?.getWalletClient()

    // const nfthash = await client.writeContract(
    //     {
    //         address: collateralAddress as `0x${string}`,
    //         abi: NftABI,
    //         functionName: 'approve',
    //         chain: chain,
    //         account: client.account.address,
    //         args: [
    //             unHODLContractAddress,
    //             collateralId
    //         ]
    //     }
    // )

    // console.log(`NFT approved txn: ${nfthash}`)

    const hash = await client.writeContract(
        {
            address: unHODLContractAddress,
            abi: LoanCoreABI,
            functionName: 'startLoan',
            chain: chain,
            account: client.account.address,
            args: [
                [
                    collateralAddress,
                    collateralId,
                    principal,
                    facilitator
                ],
            ]
        }
    )
    return hash
}



async function getLoans(account: any): Promise<LoanData[]> {
    const client = await account.connector?.getWalletClient();

    const lastLoanIndex = await publicActions(client).readContract({
        address: unHODLContractAddress,
        abi: LoanCoreABI,
        functionName: 'loanIdTracker',
        account: client.account.address,
    }) as number;

    const loans: { loan: any; id: number }[] = [];

    for (var index = 0; index < lastLoanIndex; index++) {
        const loan = await publicActions(client).readContract({
            address: unHODLContractAddress,
            abi: LoanCoreABI,
            functionName: 'getLoan',
            // functionName: 'loanId',
            account: client.account.address,
            args: [index],
        }) as LoanData;

        if (loan.state === LoanState.Active && loan.owner === client.account.address) {
            loans.push({ loan, id: index });
        }
    }

    const loansData: LoanData[] = loans.map(({ loan, id }) => ({
        id: id,
        state: loan.state,
        startDate: BigInt(loan.startDate),
        lastAccrualTimestamp: BigInt(loan.lastAccrualTimestamp),
        entryPrice: BigInt(loan.entryPrice),
        balance: BigInt(loan.balance),
        interestAmountPaid: BigInt(loan.interestAmountPaid),
        allowance: BigInt(loan.allowance),
        terms: loan.terms,
        owner: loan.owner,
    }));

    // if (loansData.length <= 0) {
    //     const testLoan: LoanData = {
    //         id: 0,
    //         allowance: 0n,
    //         balance: 10000n,
    //         interestAmountPaid: 1000n,
    //         owner: "0x8c427C56790f2C36664870a55B3A0189bFf9996d",
    //         state: 0,
    //         terms: {
    //             collateralAddress: "0x86ef4d0470dA8A06F21795055a6b8Bf9BA262059",
    //             collateralId: 0n,
    //             principal: 1000n,
    //             facilitator: 0
    //         },
    //         entryPrice: 100n,
    //         lastAccrualTimestamp: 1000n,
    //         startDate: 1000n
    //     }
    //     return [testLoan]
    // }

    return loansData;
}

async function repayDebt(
    account: any,
    chain: any,
    {
        loanId,
        amount
    }: RepayTerms
) {

    const client: WalletClient = await account.connector?.getWalletClient()

    const ghoTokenAddress = await publicActions(client).readContract({
        address: unHODLContractAddress,
        abi: LoanCoreABI,
        functionName: 'GHO',
        account: client.account.address,
    }) as `0x${string}`;

    console.log(`GHO Token address: ${ghoTokenAddress}`)

    const ghoHash = await client.writeContract(
        {
            address: ghoTokenAddress as `0x${string}`,
            abi: GhoTokenABI,
            functionName: 'approve',
            chain: chain,
            account: client.account.address,
            args: [
                unHODLContractAddress,
                amount
            ]
        }
    )

    console.log(`GHO approved txn: ${ghoHash}`)

    const hash = await client.writeContract(
        {
            address: unHODLContractAddress,
            abi: LoanCoreABI,
            functionName: 'repayDebt',
            chain: chain,
            account: client.account.address,
            args: [
                loanId,
                amount,
            ]
        }
    )
    return hash
}

async function getGhoBalance(account: any) {
    const client: WalletClient = await account.connector?.getWalletClient()

    const ghoTokenAddress = await publicActions(client).readContract({
        address: unHODLContractAddress,
        abi: LoanCoreABI,
        functionName: 'GHO',
        account: client.account.address,
    }) as `0x${string}`;

    const balance = await publicActions(client).readContract({
        address: ghoTokenAddress,
        abi: GhoTokenABI,
        functionName: 'balanceOf',
        account: client.account.address,
        args: [
            client.account.address
        ]
    }) as bigint;

    return balance
}

export { getGhoBalance, nftApproval, startLoan, repayDebt, getLoans, calculateInterestRate };
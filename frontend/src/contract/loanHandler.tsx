
import { WalletClient } from 'wagmi';
import LoanCoreArtifact from './abi/unHODL.json';

const LoanCoreABI = LoanCoreArtifact.abi;

interface LoanTerms {
    collateralAddress: string; // crypto punk address
    collateralId: bigint; // dummy token id of nft
    principal: bigint; // input borrowing amount, max borrowable buttn pull data from contract fn
    facilitator: number; // aave or our facilitator input
}

interface RepayTerms {
    loanId: bigint,
    amount: bigint
}


const unHODLContractAddress = '0x0886073e6c0da2cE601D1eC846cE2B7E0294b91E';

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

async function repayDebt(
    account: any,
    chain: any,
    {
        loanId,
        amount
    }: RepayTerms
) {

    const client: WalletClient = await account.connector?.getWalletClient()

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

export { startLoan, repayDebt };
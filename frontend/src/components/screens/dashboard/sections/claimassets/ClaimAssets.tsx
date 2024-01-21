import { InterfaceNFT } from "@/components/screens/borrow/steps/depositNFT/columns";
import { DataTable } from "@/components/screens/borrow/steps/depositNFT/data-table";
import { getStakeNFTsUser } from '@/contract/nftApi';
import { RowSelectionState } from "@tanstack/react-table";
import { motion } from 'framer-motion';
import { CSSProperties, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import LoanRepaymentSection from "./LoanRepayment";
import { columns } from "./columns";

interface ClaimAssetsProps {
    loanRepayment?: boolean
}

export default function ClaimAssetsSection({ loanRepayment }: ClaimAssetsProps) {
    const [data, setData] = useState<InterfaceNFT[]>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [loanRepay, setLoanRepay] = useState(loanRepayment ?? false);

    const layout: CSSProperties = {
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    }

    const headerStyle: CSSProperties = {
        fontFamily: "Inter",
        fontSize: "30px",
        fontWeight: "600px",
        lineHeight: "36px",
        letterSpacing: "-0.0075em",
        textAlign: "left",
        marginBottom: "16px"
    }

    const subHeaderBody: CSSProperties = {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: "400px",
        lineHeight: "24px",
        letterSpacing: "0em",
        textAlign: "left",
        marginBottom: "50px",
        color: "#A1A1AA"
    }

    const account = useAccount()

    useEffect(() => {
        Object.keys(rowSelection).length > 0 && setLoanRepay(true)
    }, [rowSelection])

    const resetState = () => {
        setRowSelection({})
        setLoanRepay(false)
    }

    useEffect(() => {
        if (account && !data.length) {
            (async () => {
                const nfts = await getStakeNFTsUser(account)
                setData(nfts)
                console.log("bal claim " + nfts[0].balance)
            })()
        }
    }, [account, data.length, setData])
    return (
        <>
            {loanRepay ?
                <div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ x: -20 }}
                        onClick={() => setLoanRepay(false)}
                        className="flex flex-row items-center gap-2 pt-6"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 12L6 8L10 4" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span onClick={resetState}>Go back</span>
                    </motion.button>
                    <LoanRepaymentSection nft={data.filter((_, index) => rowSelection[index])[0]} />
                </div> :
                (
                    <div style={layout}>

                        <div style={headerStyle}>
                            Claim assets
                        </div>
                        <div style={subHeaderBody}>
                            Claim your assets here
                        </div>

                        <DataTable
                            columns={columns}
                            data={data}
                            rowSelection={rowSelection}
                            setRowSelection={setRowSelection}
                            noAssetsCount
                        />
                    </div>
                )
            }
        </>
    );
}
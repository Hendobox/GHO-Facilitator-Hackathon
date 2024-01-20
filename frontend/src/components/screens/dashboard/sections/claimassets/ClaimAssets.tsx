import { Button } from "@/components/ui/button";
import { CSSProperties, useEffect, useState } from "react";
import LoanRepaymentSection from "./LoanRepayment";
import { motion } from 'framer-motion';
import { useAccount } from "wagmi";
import { getStakeNFTsUser } from '@/contract/nftApi'

interface ClaimAssetsProps {
    loanRepayment?: boolean
}

export default function ClaimAssetsSection({ loanRepayment }: ClaimAssetsProps) {

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

    const assetsTable: CSSProperties = {
    }

    const account = useAccount()

    useEffect(() => {
        if (account) {
            (async () => {
                const nfts = await getStakeNFTsUser(account)
                console.log(nfts)
            })()
        }
    })
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
                        <span>Go back</span>
                    </motion.button>
                    <LoanRepaymentSection />
                </div> :
                <div style={layout}>

                    <div style={headerStyle}>
                        Claim assets
                    </div>
                    <div style={subHeaderBody}>
                        Claim your assets here
                    </div>

                    <div style={assetsTable}>
                        <div> Assets table </div>
                        <Button
                            variant="ghost"
                            onClick={() => setLoanRepay(true)}
                        >
                            Loan Repay Button Placeholder
                        </Button>
                    </div>
                </div>
            }
        </>
    );
}
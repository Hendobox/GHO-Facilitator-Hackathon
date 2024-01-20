

import Card from "@/components/ui/dashboard/Card";
import { CSSProperties, useEffect, useState } from "react";
import RepayLoan from "./RepayLoan";
import { getLoans } from "@/contract/loanHandler";
import { useAccount } from "wagmi";
import { LoanData } from "@/contract/loanTypes";
import { motion } from 'framer-motion';

export default function LoanRepaymentSection() {

    const layout: CSSProperties = {
        marginTop: '24px',
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

    // const subHeaderBody: CSSProperties = {
    //     fontFamily: "Inter",
    //     fontSize: "14px",
    //     fontWeight: "400px",
    //     lineHeight: "24px",
    //     letterSpacing: "0em",
    //     textAlign: "left",
    //     marginBottom: "50px",
    //     color: "#A1A1AA"
    // }

    const [loans, setLoans] = useState<LoanData[] | null>([])
    const [loanIndex, setLoanIndex] = useState(0)
    const account = useAccount()

    function previousLoan() {
        if (loans) {
            if (loanIndex > 0) {
                setLoanIndex(loanIndex - 1)
            }
        }
    }

    function nextLoan() {
        if (loans) {
            if (loanIndex < loans.length - 1) {
                setLoanIndex(loanIndex + 1)
            }
        }
    }

    async function getLoansData() {
        const loansData = await getLoans(account)
        setLoans(loansData)
    }

    useEffect(() => {
        getLoansData()
    })

    return (
        <div style={layout}>

            <div style={headerStyle}>
                Loan repayment
            </div>

            <div className="mt-4 mb-4 flex flex-row w-full justify-between">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: -20 }}
                    onClick={previousLoan}
                    className="flex flex-row items-center gap-2 pr-5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="16" viewBox="0 0 7 16"><path fill="currentColor" d="M5.5 13a.47.47 0 0 1-.35-.15l-4.5-4.5c-.2-.2-.2-.51 0-.71l4.5-4.49c.2-.2.51-.2.71 0c.2.2.2.51 0 .71L1.71 8l4.15 4.15c.2.2.2.51 0 .71c-.1.1-.23.15-.35.15Z" /></svg>
                    <span>Previous Loan</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ x: -20 }}
                    onClick={nextLoan}
                    className="flex flex-row items-center gap-2 pl-5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="16" viewBox="0 0 7 16"><path fill="currentColor" d="M1.5 13a.47.47 0 0 1-.35-.15c-.2-.2-.2-.51 0-.71L5.3 7.99L1.15 3.85c-.2-.2-.2-.51 0-.71c.2-.2.51-.2.71 0l4.49 4.51c.2.2.2.51 0 .71l-4.5 4.49c-.1.1-.23.15-.35.15" /></svg>
                    <span>Next Loan</span>
                </motion.button>
            </div>

            {loans
                ? <Card height="478px" width="956px" >
                    <RepayLoan data={loans?.[loanIndex]} />
                </Card>

                // put a loading state here
                : <Card height="478px" width="956px" >
                    <RepayLoan />
                </Card>}
            <div className="mt-10">
                <div> Loan collateral </div>
                <div className="mt-4">Collateral table placeholder</div>
            </div>
        </div >
    );
}
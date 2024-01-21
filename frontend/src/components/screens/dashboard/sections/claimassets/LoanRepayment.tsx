

import { InterfaceNFT } from "@/components/screens/borrow/steps/depositNFT/columns";
import Card from "@/components/ui/dashboard/Card";
import { CSSProperties, useEffect } from "react";
import RepayLoan from "./RepayLoan";

export default function LoanRepaymentSection({
    nft,
}: {
    nft: InterfaceNFT,
}) {

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

    useEffect(() => {
        // async function getLoansData() {
        //     const loansData = await getLoans(account)
        //     setLoans(loansData)
        //     console.log("🚀 ~ useEffect ~ loan:", loansData)
        // }
        // if (!loans?.length) {
        //     getLoansData()
        console.log(nft)
        console.log(nft.loanId)
    })
    // }, [account, loans?.length])

    return (
        <div style={layout}>

            <div style={headerStyle}>
                Loan repayment
            </div>

            <Card height="478px" width="956px" >
                <RepayLoan balance={nft.balance} loanId={nft.loanId} />
            </Card>

            <div className="mt-10">
                <div> Loan collateral </div>
                <div className="mt-4">Collateral table placeholder</div>
            </div>
        </div >
    );
}
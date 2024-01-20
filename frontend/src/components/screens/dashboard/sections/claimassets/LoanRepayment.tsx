

import Card from "@/components/ui/dashboard/Card";
import { CSSProperties } from "react";
import RepayLoan from "../dashboard/datacards/RepayLoan";

export default function LoanRepaymentSection() {

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

    return (
        <div style={layout}>

            <div style={headerStyle}>
                Loan repayment
            </div>
            <div style={subHeaderBody}>
                lorem ipsum color damut lorem ipsum color damut lorem ipsum color damut
            </div>

            <Card height="478px" width="956px" >
                <RepayLoan data={{}} />
            </Card>
            <div className="mt-10">
                <div> Loan collateral </div>
                <div className="mt-4">Collateral table placeholder</div>
            </div>
        </div >
    );
}
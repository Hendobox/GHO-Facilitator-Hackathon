import { Button } from "@/components/ui/button";
import { CSSProperties, useState } from "react";
import LoanRepaymentSection from "./LoanRepayment";

export default function ClaimAssetsSection() {

    const [loanRepay, setLoanRepay] = useState(false);

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
    return (
        <>
            {loanRepay ? <LoanRepaymentSection /> :
                <div style={layout}>

                    <div style={headerStyle}>
                        Claim assets
                    </div>
                    <div style={subHeaderBody}>
                        lorem ipsum color damut lorem ipsum color damut lorem ipsum color damut
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
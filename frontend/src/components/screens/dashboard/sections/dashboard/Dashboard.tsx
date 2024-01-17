

import Card from "@/components/ui/dashboard/Card";
import { CSSProperties } from "react";
import LoanSummary from "./cards/LoanSummary";
import WalletBalance from "./cards/WalletBalance";
import CollateralValue from "./cards/CollateralValue";
import AvailableBuffer from "./cards/AvailableBuffer";
import RepayLoan from "./cards/RepayLoan";

export default function DashboardSection() {

    const layout: CSSProperties = {
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    }

    const dashContent: CSSProperties = {
        display: 'flex', // 862 404 236
        flexDirection: 'row',
        height: '66%'
    }

    const firstHalfDashContent: CSSProperties = {
        marginRight: '24px',
        width: '56%'
    }

    const headerStyle: CSSProperties = {
        fontFamily: "Inter",
        fontSize: "30px",
        fontWeight: "600px",
        lineHeight: "36px",
        letterSpacing: "-0.0075em",
        textAlign: "left",
        marginBottom: "32px"
    }

    const secondHalfDashContent: CSSProperties = {
        width: '42%'
    }

    const txnContent: CSSProperties = {
    }
    return (
        <div style={layout}>
            <div style={dashContent}>
                <div style={firstHalfDashContent}>
                    <div style={headerStyle}>
                        Dashboard
                    </div>
                    <div className="flex flex-row mb-3" >
                        <Card height="188px" width="331px">
                            <LoanSummary />
                        </Card>
                        <div className="w-3" />
                        <Card height="188px" width="331px">
                            <WalletBalance />
                        </Card>
                    </div>
                    <div className="flex flex-row">
                        <Card height="188px" width="331px">
                            <CollateralValue />
                        </Card>
                        <div className="w-3" />
                        <Card height="188px" width="331px" >
                            <AvailableBuffer />
                        </Card>
                    </div>
                </div>
                <div style={secondHalfDashContent}>
                    <Card height="457px" width="331px">
                        <RepayLoan />
                    </Card>
                </div>
            </div>
            <div style={txnContent}>
                <div> Transactions </div>
            </div>
        </div>
    );
}
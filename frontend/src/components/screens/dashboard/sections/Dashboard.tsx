

import { CSSProperties } from "react";

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
        width: '54%'
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
                </div>
                <div style={secondHalfDashContent}>
                    Second half of top section of dashboard (the huge card)
                </div>
            </div>
            <div style={txnContent}>
                <div> Transactions </div>
            </div>
        </div>
    );
}
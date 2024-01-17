

import { CSSProperties } from "react";

export default function ClaimAssetsSection() {

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
        marginBottom: "50px"
    }

    const assetsTable: CSSProperties = {
    }
    return (
        <div style={layout}>

            <div style={headerStyle}>
                Claim assets
            </div>
            <div style={subHeaderBody}>
                lorem ipsum color damut lorem ipsum color damut lorem ipsum color damut
            </div>

            <div style={assetsTable}>
                <div> Assets table </div>
            </div>
        </div>
    );
}


import { AccordionCard } from "@/components/ui/dashboard/AccordionCard";
import { CSSProperties } from "react";
import StakeAccordionCard from "./accordioncards/StakeAccordionCard";
import WithdrawAccordionCard from "./accordioncards/WithDrawAccordionCard";

export default function PortfolioSection() {

    const gho = "17 02";

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
        marginBottom: "40px"
    }

    const availableHeaderBody: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        width: "263px",
        height: "28px",
        top: "260px",
        left: "1057px",
        gap: "8px",
        marginLeft: "940px",
        alignItems: 'center'
    }

    const availableText: CSSProperties = {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: "500px",
        lineHeight: "24px",
        letterSpacing: "0em",
        textAlign: "left",
        color: "#A1A1AA",
    }

    const ghoText: CSSProperties = {
        fontFamily: "Inter",
        fontSize: "20px",
        fontWeight: "600px",
        lineHeight: "28px",
        letterSpacing: "-0.005em",
        textAlign: "right",
    }

    return (
        <div style={layout}>

            <div style={headerStyle}>
                Portfolio
            </div>
            <div style={subHeaderBody}>
                Earn interest on staking GHO, or simply withdraw into your preferred wallet or chain.
            </div>

            <div style={availableHeaderBody}>
                <div style={availableText} >Available</div>
                <div style={ghoText}>{gho} GHO</div>
            </div>

            <div className="m-10" >
                <AccordionCard title="Stake">
                    <StakeAccordionCard />
                </AccordionCard>
                <div className="mt-10" />
                <AccordionCard title="Withdraw">
                    <WithdrawAccordionCard />
                </AccordionCard>
            </div>
        </div>
    );
}
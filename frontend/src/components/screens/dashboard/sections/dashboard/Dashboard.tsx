

import Card from "@/components/ui/dashboard/Card";
import { CSSProperties } from "react";
import TotalStaked from "./datacards/TotalStaked";
import Earnings from "./datacards/Earnings";
import LoanAmount from "./datacards/LoanAmount";
import AvailableBuffer from "./datacards/AvailableBuffer";
import StakeBuffer from "./actioncards/StakeBuffer";
import RepayKeepStake from "./actioncards/RepayKeepStake";
import RepayUnstake from "./actioncards/RepayUnstake";
import { DashboardSections } from "../../types";

export default function DashboardSection({
    setSelectedItem
}: {
    setSelectedItem: (_: DashboardSections) => void
}) {

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
        marginBottom: "32px"
    }

    return (
        <div style={layout}>
            <div >
                <div style={headerStyle}>
                    Dashboard
                </div>

                {/* Data Cards */}
                <div className="flex flex-row mb-10 " >
                    <Card color="#6D28D9" height="108px" width="227px">
                        <TotalStaked />
                    </Card>

                    <div className="w-4" />

                    <Card color="#6D28D9" height="108px" width="227px">
                        <Earnings />
                    </Card>

                    <div className="w-4" />

                    <Card color="#6D28D9" height="108px" width="227px">
                        <LoanAmount />
                    </Card>

                    <div className="w-4" />

                    <Card color="#6D28D9" height="108px" width="227px" >
                        <AvailableBuffer />
                    </Card>
                </div>

                {/* Action Cards */}
                <div className="flex flex-row mb-10 " >
                    <Card height="304px" width="308px" >
                        <StakeBuffer />
                    </Card>

                    <div className="w-4" />

                    <Card height="304px" width="308px" >
                        <RepayKeepStake onButtonClick={() => setSelectedItem(DashboardSections.ClaimAssets)} />
                    </Card>

                    <div className="w-4" />

                    <Card height="304px" width="308px" >
                        <RepayUnstake onButtonClick={() => setSelectedItem(DashboardSections.ClaimAssets)} />
                    </Card>

                </div>
            </div>
        </div>
    );
}
import { CSSProperties, useState } from "react"
import DashboardSelector from "@/components/ui/dashboard/Selector"
import DashboardSection from "./sections/Dashboard"
import ClaimAssetsSection from "./sections/ClaimAssets"
import PortfolioSection from "./sections/Portfolio"

export default function DashboardLayout() {

    const [section, setSection] = useState("Dashboard");

    const lineStyle: CSSProperties = {
        height: '88vh',
        marginLeft: '24px',
        marginRight: '40px',
        borderColor: '#3F3F46',
    }

    return (
        <div className="h-[calc(90vh-104px) flex flex-row text-white mx-28 border-t-[1px] border-[#3F3F46]">

            <DashboardSelector onSelectionChange={function (selectedItem: string): void {
                setSection(selectedItem)
            }} />

            {/* vertical white line */}
            <div style={lineStyle} className=' border-r-[1px]' />

            {section === "Dashboard" && <DashboardSection />}
            {section === "Claim Assets" && <ClaimAssetsSection />}
            {section === "Portfolio" && <PortfolioSection />}
        </div>
    )
}

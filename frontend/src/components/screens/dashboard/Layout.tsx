import DashboardSelector from "@/components/ui/dashboard/Selector";
import { useState } from "react";
import ClaimAssetsSection from "./sections/claimassets/ClaimAssets";
import DashboardSection from "./sections/dashboard/Dashboard";
import PortfolioSection from "./sections/portfolio/Portfolio";
import { DashboardSections } from "./types";

interface DashboardProps {
    repayLoan?: boolean
}


export default function DashboardLayout({ repayLoan }: DashboardProps) {
    const [selectedItem, setSelectedItem] = useState<DashboardSections>(
        repayLoan ? DashboardSections.ClaimAssets : DashboardSections.Dashboard);

    return (
        <div className="h-[calc(90vh-105px) flex flex-row text-white px-28 border-t-[1px] border-[#3F3F46]">

            <DashboardSelector
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
            />

            {/* vertical white line */}
            <div className='ml-6 mr-10 h-[calc(100vh-105px)] border-r-[1px] border-[#3F3F46]' />

            {selectedItem === DashboardSections.Dashboard && <DashboardSection setSelectedItem={setSelectedItem} />}
            {selectedItem === DashboardSections.ClaimAssets && <ClaimAssetsSection loanRepayment={repayLoan} />}
            {selectedItem === DashboardSections.Portfolio && <PortfolioSection />}
        </div>
    )
}

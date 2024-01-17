import DashboardSelector from "@/components/ui/dashboard/Selector";
import { useState } from "react";
import ClaimAssetsSection from "./sections/ClaimAssets";
import DashboardSection from "./sections/Dashboard";
import PortfolioSection from "./sections/Portfolio";
import { DashboardSections } from "./types";

export default function DashboardLayout() {
    const [selectedItem, setSelectedItem] = useState<DashboardSections>(DashboardSections.Dashboard);

    return (
        <div className="h-[calc(90vh-105px) flex flex-row text-white px-28 border-t-[1px] border-[#3F3F46]">

            <DashboardSelector
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
            />

            {/* vertical white line */}
            <div className='ml-6 mr-10 h-[calc(100vh-105px)] border-r-[1px] border-[#3F3F46]' />

            {selectedItem === DashboardSections.Dashboard && <DashboardSection />}
            {selectedItem === DashboardSections.ClaimAssets && <ClaimAssetsSection />}
            {selectedItem === DashboardSections.Portfolio && <PortfolioSection />}
        </div>
    )
}

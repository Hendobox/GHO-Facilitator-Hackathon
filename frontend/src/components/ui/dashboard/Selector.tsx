import { DashboardSections } from "@/components/screens/dashboard/types";
import { motion } from 'framer-motion';
import React, { CSSProperties } from 'react';

interface ItemProps {
    title: string;
    isSelected: boolean;
    onSelect: () => void;
}

const Item: React.FC<ItemProps> = ({ title, isSelected, onSelect }) => {

    const itemIcon = {
        "Dashboard": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 3H3V12H10V3Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 3H14V8H21V3Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H14V21H21V12Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 16H3V21H10V16Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        ,
        "Claim assets": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5C17.5 5 16.2 6.4 16 7C12.5 5.5 5 6.7 5 12C5 13.8 5 15 7 16.5V20H11V18H14V20H18V16C19 15.5 19.7 15 20 14H22V10H20C20 9 19.5 8.5 19 8V5Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 9V10C2 11.1 2.9 12 4 12H5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        </svg>,
        "Portfolio": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.09 10.3701C19.0353 10.7225 19.8765 11.3076 20.5358 12.0713C21.195 12.835 21.6511 13.7526 21.8617 14.7392C22.0724 15.7258 22.0309 16.7496 21.741 17.716C21.4512 18.6823 20.9223 19.5599 20.2034 20.2677C19.4845 20.9755 18.5987 21.4906 17.628 21.7653C16.6572 22.0401 15.6329 22.0656 14.6497 21.8396C13.6665 21.6135 12.7561 21.1432 12.0028 20.4721C11.2495 19.801 10.6776 18.9508 10.34 18.0001" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 6H8V10" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.71 13.8799L17.41 14.5899L14.59 17.4099" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    }
    const itemStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '12px 16px',
        gap: '8px',
        width: '180px',
        height: '48px',
        background: isSelected ? '#27272A' : undefined,
        cursor: 'pointer'
    };

    return (
        <motion.div
            style={itemStyle}
            onClick={onSelect}
            whileTap={{ scale: 0.95 }}
        >
            {title === "Dashboard" && itemIcon.Dashboard}
            {title === "Claim Assets" && itemIcon['Claim assets']}
            {title === "Portfolio" && itemIcon.Portfolio}
            {title}
        </motion.div>
    );
};


interface DashboardSelectorProps {
    selectedItem: DashboardSections;
    setSelectedItem: (item: DashboardSections) => void;
}

const DashboardSelector: React.FC<DashboardSelectorProps> = ({ selectedItem, setSelectedItem }) => {

    const sidebarStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingTop: '40px',
        gap: '16px',
        width: '180px',
        height: '176px',
        left: '120px',
        top: '144px'
    };

    const handleSelect = (item: DashboardSections) => {
        setSelectedItem(item);
    };

    return (
        <div>
            <div style={sidebarStyle}>
                <Item title="Dashboard" isSelected={selectedItem === DashboardSections.Dashboard} onSelect={() => handleSelect(DashboardSections.Dashboard)} />
                <Item title="Claim Assets" isSelected={selectedItem === DashboardSections.ClaimAssets} onSelect={() => handleSelect(DashboardSections.ClaimAssets)} />
                <Item title="Portfolio" isSelected={selectedItem === DashboardSections.Portfolio} onSelect={() => handleSelect(DashboardSections.Portfolio)} />
            </div>
        </div>
    );
};

export default DashboardSelector;
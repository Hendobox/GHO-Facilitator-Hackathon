import { DashboardSections } from "@/components/screens/dashboard/types";
import { motion } from 'framer-motion';
import React, { CSSProperties } from 'react';

interface ItemProps {
    title: string;
    isSelected: boolean;
    onSelect: () => void;
}

const Item: React.FC<ItemProps> = ({ title, isSelected, onSelect }) => {
    const itemStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
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
import React, { CSSProperties, useState } from 'react';
import { motion } from 'framer-motion';

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
    onSelectionChange: (selectedItem: string) => void;
}

const DashboardSelector: React.FC<DashboardSelectorProps> = ({ onSelectionChange }) => {
    const [selectedItem, setSelectedItem] = useState<string>('Dashboard');

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

    const handleSelect = (item: string) => {
        setSelectedItem(item);
        onSelectionChange(item);
    };

    return (
        <div>
            <div style={sidebarStyle}>
                <Item title="Dashboard" isSelected={selectedItem === 'Dashboard'} onSelect={() => handleSelect('Dashboard')} />
                <Item title="Claim Assets" isSelected={selectedItem === 'Claim Assets'} onSelect={() => handleSelect('Claim Assets')} />
                <Item title="Portfolio" isSelected={selectedItem === 'Portfolio'} onSelect={() => handleSelect('Portfolio')} />
            </div>
        </div>
    );
};

export default DashboardSelector;
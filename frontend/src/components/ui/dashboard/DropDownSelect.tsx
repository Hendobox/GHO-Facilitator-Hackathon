import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DropDownSelectProps {
    values: string[];
    placeholder?: string;
    onValueChange: (value: string) => void;
}

export function DropDownSelect({ values, placeholder, onValueChange }: DropDownSelectProps) {

    const handleChange = (value: string) => {
        onValueChange(value);
    };


    return (
        <Select defaultValue={values[0]} onValueChange={handleChange}>
            <SelectTrigger style={{ backgroundColor: '#3F3F46' }} className="w-[140px]">
                <SelectValue placeholder={placeholder || values[0]} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup >
                    {values.map((value, index) => (
                        <SelectItem key={index} value={value}>{value}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

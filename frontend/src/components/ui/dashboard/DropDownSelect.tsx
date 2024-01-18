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
    color?: string
    className?: string
}

export function DropDownSelect({ values, placeholder, onValueChange, color, className }: DropDownSelectProps) {

    const handleChange = (value: string) => {
        onValueChange(value);
    };


    return (
        <Select defaultValue={values[0]} onValueChange={handleChange}>
            <SelectTrigger style={{ backgroundColor: color ?? '#3F3F46' }} className={className ?? "w-[140px]"}>
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

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
            <SelectTrigger style={{ backgroundColor: color ?? '#3F3F46' }} className={className ?? "h-full border-none bg-zinc-700 w-[140px]"}>
                <SelectValue placeholder={placeholder || values[0]} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-700 text-white border-none">
                <SelectGroup >
                    {values.map((value, index) => (
                        <SelectItem className="text-zinc-200 focus:bg-zinc-500 focus:text-white" key={index} value={value}>{value}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

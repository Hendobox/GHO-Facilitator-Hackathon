import { cn } from "@/lib/utils"

export default function CustomInput({
    value,
    onChange,
    placeholder,
    type = "text",
    className,
    disabled,
    label,
    icon,
    subtext,
    readOnly = false,
    actionElement,
    ...props
}: {
    value: string
    onChange?: (value: string) => void
    readOnly?: boolean
    placeholder?: string
    type?: string
    className?: string
    disabled?: boolean
    label?: string
    icon?: string
    subtext?: string
    actionElement?: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <div className="flex flex-row justify-start gap-2 items-center">
                    <label className="text-sm font-medium text-white">
                        {label}
                    </label>
                    {icon && <Icon icon={icon} />}
                </div>
            )}
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full h-10 px-2 text-sm placeholder-zinc-400 bg-zinc-800 text-white rounded-[4px] focus:outline-none",
                        { "text-zinc-600": readOnly },
                        className
                    )}
                    disabled={disabled}
                    readOnly={readOnly}
                    {...props}
                />
                {actionElement && <div className="absolute right-0 top-0 h-full">
                    {actionElement}
                </div>}
            </div>
            {
                subtext && (
                    <span className="text-sm text-zinc-400">{subtext}</span>
                )
            }
        </div >
    )
}

export const Icon = ({ icon }: { icon: string }) => {
    if (icon === "document") {
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
            <path d="M11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551ZM15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918Z">
            </path>
        </svg>
    }
    return null
}
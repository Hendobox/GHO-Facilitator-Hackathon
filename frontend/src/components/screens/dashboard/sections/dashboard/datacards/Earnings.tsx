interface EarningsProps {
    data?: number
}

export default function Earnings(props: EarningsProps) {
    const earnings = 500;
    return (
        <>
            <div className="text-sm mb-2 font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Earnings
            </div>
            <div className="text-lg" >
                {props.data?.toLocaleString('en-IN') ?? earnings.toLocaleString('en-IN')} GHO
            </div>
        </>
    )
}
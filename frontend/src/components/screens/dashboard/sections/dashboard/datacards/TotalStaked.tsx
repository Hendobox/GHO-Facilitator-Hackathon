interface TotalStakedProps {
    data?: number
}

export default function TotalStaked(props: TotalStakedProps) {
    const stakeAmount: number = 13702;

    return (
        <>
            <div className="text-sm mb-2 font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Total staked
            </div>
            <div className="text-lg" >
                {props.data?.toLocaleString('en-IN') ?? stakeAmount.toLocaleString('en-IN')} GHO
            </div>
        </>
    )
}
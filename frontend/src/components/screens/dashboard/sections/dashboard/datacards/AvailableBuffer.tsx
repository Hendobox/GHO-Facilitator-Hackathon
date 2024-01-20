interface AvailableBufferProps {
    data?: number
}

export default function AvailableBuffer(props: AvailableBufferProps) {
    const availableBuffer: number = 24153
    return (
        <>
            <div className="text-sm mb-2 font-['Inter'] font-medium leading-[24px] text-[#a1a1aa]">
                Available buffer
            </div>
            <div className="text-lg" >
                {props.data?.toLocaleString('en-IN') ?? availableBuffer.toLocaleString('en-IN')} GHO
            </div>
        </>
    )
}
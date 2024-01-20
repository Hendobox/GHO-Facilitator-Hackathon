import { CSSProperties, PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren {
    height: string,
    width: string,
    color?: string
}

export default function Card(props: CardProps) {

    const cardStyle: CSSProperties = {
        height: props.height,
        width: props.width,
        border: '1px solid #3F3F46',
        borderRadius: '8px',
        backgroundColor: props.color ??
            'linear-gradient(0deg, #3F3F46, #3F3F46), linear-gradient(0deg, #18181B, #18181B)',
        padding: '24px',
    }

    return (
        <div style={cardStyle}>
            {props.children}
        </div>
    );
}
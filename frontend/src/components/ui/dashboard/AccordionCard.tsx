import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { CSSProperties, PropsWithChildren } from "react"

interface AccordionCardProps extends PropsWithChildren {
    title: string
}

export function AccordionCard(props: AccordionCardProps) {

    const accordionStyle: CSSProperties = {
        border: '1px solid #3F3F46',
        borderRadius: '8px',
        backgroundColor: 'linear-gradient(0deg, #3F3F46, #3F3F46), linear-gradient(0deg, #18181B, #18181B)',
        padding: '24px',
    }

    return (
        <div style={accordionStyle} >
            <Accordion type='single' collapsible >
                <AccordionItem value="item-1" style={{ borderWidth: '0px' }} >
                    <AccordionTrigger style={{
                        textDecoration: "none",
                        fontSize: '16px',
                        fontWeight: '500px',
                        fontFamily: "inter"
                    }} >
                        {props.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        {props.children}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

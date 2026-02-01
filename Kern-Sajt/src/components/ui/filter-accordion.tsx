import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    className?: string
}

export function FilterAccordionItem({ title, children, defaultOpen = false, className }: AccordionItemProps) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
        <div className={cn("border-b py-2", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-1 items-center justify-between py-2 text-sm font-medium transition-all hover:underline w-full text-left"
            >
                {title}
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 transition-transform duration-200" />
                ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                )}
            </button>
            {isOpen && (
                <div className="pb-4 pt-1 animate-in slide-in-from-top-2 text-sm">
                    {children}
                </div>
            )}
        </div>
    )
}

import { cn } from "~/lib/utils";

interface QuoteProps {
    title: string;
    description: string;
    quoteIcon?: React.ReactNode;
    className?: string;
}

export function Quote({ title, description, quoteIcon, className }: QuoteProps) {
    return (
        <div className={cn("quote flow wrapper py-xs", className)}>
            {quoteIcon && (
                <div className="quote__icon">
                    {quoteIcon}
                </div>
            )}
            <div className="flow">
                <h4 className="quote__title cluster">
                    {title}
                </h4>
                <p className="quote__description cluster">
                    {description}
                </p>
            </div>
        </div>
    )
}
import { cn } from "~/lib/utils";

export function Headline({className, children, title, ...props}: React.ComponentProps<"section">) {
    return (
        <section className={cn("headline repel mb-xs", className)} {...props}>
            <h3 className="font-display">{title}</h3>
            {children}
        </section>
    )
}
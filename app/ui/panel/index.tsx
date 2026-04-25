import { cn } from "~/lib/utils";

type PanelProps = React.ComponentProps<"div"> & {
    icon?: React.ReactNode
}

export function PanelControls({className, children, ...props}: React.ComponentProps<"div">) {
    return <div className={cn("panel__controls", className)} {...props}>{children}</div>
}

export function PanelInfo({className, children, ...props}: React.ComponentProps<"div">) {
    return <div className={cn("panel__controls", className)} {...props}>{children}</div>
}

export function Panel({className, children, title, icon, ...props}: PanelProps) {
    return (
        <div className={cn("panel wrapper", className)} {...props}>
            <div className={cn("panel__title mb-xs")}>
                {icon && <div className="panel__title-icon">{icon}</div>}
                {title}
            </div>
            <div className="panel__container switcher">
                {children}
            </div>
        </div>
    )
}
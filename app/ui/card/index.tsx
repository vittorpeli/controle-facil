import { cn } from "~/lib/utils";

export function Card({className, children, ...props}: React.ComponentProps<"div">) {
    return <div className={cn("card", className)} {...props}>{children}</div>
}

export function CardHeader({ className, children, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("card__header", className)} {...props}>{children}</div>
}

export function CardTitle({ className, children, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("card__title", className)} {...props}>{children}</div>
}

export function CardDescription({ className, children, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("card__description", className)} {...props}>{children}</div>
}

export function CardAction({ className, children, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("card__action", className)} {...props}>{children}</div>
}

export function CardContent({ className, children, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("card__content", className)} {...props}>{children}</div>
}

export function CardMedia({ className, children, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("card__media", className)} {...props}>{children}</div>
}

export function CardFooter({ className, children, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("card__footer", className)} {...props}>{children}</div>
}
import { cn } from "~/lib/utils";

export function Button({ className, children, ...props }: React.ComponentProps<"button">) {
    return <button className={cn("button", className)} {...props}>{children}</button>
}
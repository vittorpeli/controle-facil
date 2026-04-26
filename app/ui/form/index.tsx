import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import * as LabelPrimitive from "@radix-ui/react-label";
import { CheckIcon } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "../Button";

export function Input({className, type, ...props}: React.ComponentProps<'input'>) {
    return <input className={cn('input', className)} type={type} {...props} />
}

export function Label({className, ...props}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    return <LabelPrimitive.Root className={cn("label", className)} {...props} />
}

export function Checkbox({className, ...props}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root className={cn("checkbox", className)} {...props}>
            <CheckboxPrimitive.Indicator className="checkbox-indicator">
                <CheckIcon />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}

export function FieldSet({className, ...props}: React.ComponentProps<'fieldset'>) {
    return (
        <fieldset
            data-slot="fieldset" 
            className={cn('fieldset', className)} 
            {...props}
        />
    )
}

export function FieldSetInput({className, ...props}: React.ComponentProps<'input'>) {
    return (
        <Input 
            data-slot="fieldset-control" 
            className={cn('fieldset__input', className)}
            {...props} 
        />
    )
}

export function FieldSetIcon({className, ...props}: React.ComponentProps<'span'>) {
    return <span className={cn('fieldset__icon', className)} {...props} />
}

export function FieldSetButton({className, ...props}: React.ComponentProps<'button'>) {
    return <Button className={cn('fieldset__button', className)} {...props} />
}
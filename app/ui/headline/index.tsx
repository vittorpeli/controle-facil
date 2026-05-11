import { cn } from '~/lib/utils'

export function Headline({
  className,
  children,
  title,
  ...props
}: React.ComponentProps<'section'>) {
  return (
    <section className={cn('headline repel mb-3xs', className)} {...props}>
      <h4 className="font-display">{title}</h4>
      {children && <span>{children}</span>}
    </section>
  )
}

import { cn } from '~/lib/utils'

export function Table({ className, children, ...props }: React.ComponentProps<"table">) {
  return (
    <table className={cn('table', className)} {...props}>
      {children}
    </table>
  )
}

export function TableHeader({className, children, ...props}: React.ComponentProps<"thead">) {
    return <thead className={cn('table__header', className)} {...props}>{children}</thead>
}

export function TableRow({className, children, ...props}: React.ComponentProps<"tr">) {
    return <tr className={cn('table__row', className)} {...props}>{children}</tr>
}

export function TableHead({className, children, ...props}: React.ComponentProps<"th">) {
    return <th className={cn('table__head', className)} {...props}>{children}</th>
}

export function TableBody({className, children, ...props}: React.ComponentProps<"tbody">) {
    return <tbody className={cn('table__body', className)} {...props}>{children}</tbody>
}

export function TableCell({className, children, ...props}: React.ComponentProps<"td">) {
    return <td className={cn('table__cell', className)} {...props}>{children}</td>
}

export function TableCellIcon({className, children, ...props}: React.ComponentProps<"div">) {
    return <div className={cn('table__cell-icon', className)} {...props}>{children}</div>
}

export function TableFooter({className, children, ...props}: React.ComponentProps<"tfoot">) {
    return <tfoot className={cn('table__footer', className)} {...props}>{children}</tfoot>
}

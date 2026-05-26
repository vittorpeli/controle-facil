import { currencyFormatter } from '~/features/shared/currency-formatter'
import { cn } from '~/lib/utils'

interface GoalProgressBarProps {
  value: number
  currentAmount: number
  targetAmount: number
  className?: string
}

export const GoalProgressBar = ({
  value,
  currentAmount,
  targetAmount,
  className,
}: GoalProgressBarProps) => {
  const remaining = Math.max(targetAmount - currentAmount, 0)

  return (
    <div className={cn('flow gap-2xs', className)}>
      <div className="flex items-center justify-between text-step--2 text-dark-glare">
        <span className="font-medium">
          Progresso para {currencyFormatter.format(targetAmount)}
        </span>

        <strong className="text-primary">{value.toFixed(0)}%</strong>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-light">
        <div
          className="h-full rounded full bg-primary transition-all duration-300"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-step--2 text-dark-glare">
        <strong>{currencyFormatter.format(currentAmount)} atual</strong>

        <strong>{currencyFormatter.format(remaining)} restante</strong>
      </div>
    </div>
  )
}

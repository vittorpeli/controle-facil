import { getBudgetProgressStatus } from '../services/get-budget-progress'

export function BudgetProgress({
  progress,
}: {
  progress: number
  status: 'safe' | 'warning' | 'danger'
}) {
  const status = getBudgetProgressStatus(progress)

  const getBarColor = () => {
    if (status === 'safe') {
      return 'bg-primary'
    }

    if (status === 'warning') {
      return 'bg-amber-400'
    }

    return 'bg-error'
  }

  return (
    <div className="flex items-center gap-2xs">
      <div className="h-1 w-full overflow-hidden rounded-full bg-mid">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="font-semibold text-step--2 whitespace-nowrap">
        {`${progress.toFixed(0)}%`}
      </span>
    </div>
  )
}

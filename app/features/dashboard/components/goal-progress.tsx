export function GoalProgress({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-2xs">
      <div className="h-1 w-full overflow-hidden rounded-full bg-mid">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="font-semibold text-step--2 whitespace-nowrap">
        {`${progress.toFixed(0)}% do objetivo`}
      </span>
    </div>
  )
}

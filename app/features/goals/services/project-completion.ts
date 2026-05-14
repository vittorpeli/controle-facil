export function projectCompletion(
  currentAmount: number,
  targetAmount: number,
  monthlyAverage: number,
): Date | null {
  if (monthlyAverage <= 0) return null

  const remainingAmount = targetAmount - currentAmount
  if (remainingAmount <= 0) return null

  const monthsNeeded = Math.ceil(remainingAmount / monthlyAverage)

  const projectedDate = new Date()
  projectedDate.setMonth(projectedDate.getMonth() + monthsNeeded)

  return projectedDate
}

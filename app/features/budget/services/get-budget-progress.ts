export function getBudgetProgressStatus(
  progress: number,
): 'safe' | 'warning' | 'danger' {
  if (progress < 80) return 'safe'
  if (progress <= 100) return 'warning'
  return 'danger'
}

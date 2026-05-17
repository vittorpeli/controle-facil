import type { UUID } from 'node:crypto'

export type Budget = {
  id: UUID
  userId: UUID
  categoryId: UUID
  month: number
  year: number
  limitAmount: number
  createdAt: Date
}

export type BudgetProgress = Budget & {
  spentAmount: number
  progressPercentage: number
  status: 'safe' | 'warning' | 'danger'
}

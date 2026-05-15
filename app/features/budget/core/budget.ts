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

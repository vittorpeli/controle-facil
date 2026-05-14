import type { UUID } from 'node:crypto'

export type Goal = {
  id: UUID
  userId: UUID
  name: string
  targetAmount: number
  deadline: Date
  description: string | null
  createdAt: Date
}

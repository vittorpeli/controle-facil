import type { UUID } from 'node:crypto'
import type { Frequency } from '~/lib/db/schema'

export type { Frequency }

export type Recurrence = {
  id: UUID
  userId: UUID
  name: string
  amount: number
  frequency: Frequency
  dueDay: number
  accountId: UUID
  categoryId: UUID | null
  isSubscription: boolean
  createdAt: Date
}

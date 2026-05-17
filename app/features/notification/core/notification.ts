import type { UUID } from 'node:crypto'
import type { TransactionType } from '~/lib/db/schema'

export type { TransactionType }

export type Notification = {
  id: UUID
  userId: UUID
  type: TransactionType
  referenceId: UUID
  referenceType: 'recurrence' | 'budget' | 'goal'
  isRead: boolean
  createdAt: Date
}

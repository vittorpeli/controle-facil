import type { UUID } from 'node:crypto'
import type { TransactionStatus, TransactionType } from '~/lib/db/schema'

export type { TransactionStatus, TransactionType }

export type Transaction = {
  id: UUID
  userId: UUID
  accountId: UUID
  transferGroupId: UUID | null
  type: TransactionType
  amount: number
  date: Date
  categoryId: UUID | null
  description: string | null
  goalId: UUID | null
  status: TransactionStatus
  createdAt: Date
}

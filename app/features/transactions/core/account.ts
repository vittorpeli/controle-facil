import type { UUID } from 'crypto'
import type { AccountType } from '~/lib/db/schema'

export type Account = {
  id: UUID
  userId: UUID
  name: string
  type: AccountType
  institution: string | null
  isArchived: boolean
  createdAt: Date
}

export type AccountWithBalance = Account & { balance: number }

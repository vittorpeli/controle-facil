import type { UUID } from 'node:crypto'
import type { OccurrenceStatus } from '~/lib/db/schema'

export type { OccurrenceStatus }

export type Occurrence = {
  id: UUID
  recurrenceId: UUID
  dueDate: Date
  status: OccurrenceStatus
  transactionId: UUID
}

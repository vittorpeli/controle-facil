import type { OccurrenceStatus } from '../../core/occurrence'
import type { Recurrence } from '../../core/recurrence'

export type RecurrenceWithStatus = Recurrence & {
  monthStatus: OccurrenceStatus
  nextDueDate: Date
}

import type { UUID } from 'node:crypto'
import type { Occurrence } from '../../core/occurrence'

export interface OccurrencesRepository {
  create(occurrence: Occurrence): Promise<Occurrence>
  findByRecurrenceIdAndDate(
    recurrenceId: UUID,
    month: number,
    year: number,
  ): Promise<Occurrence | null>
}

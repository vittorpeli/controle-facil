import type { UUID } from 'node:crypto'
import type { Occurrence } from '../../core/occurrence'

export interface OccurrencesRepository {
  create(occurrence: Occurrence): Promise<Occurrence>
  findById(id: UUID): Promise<Occurrence | null>
  findByRecurrenceIdAndDate(
    recurrenceId: UUID,
    month: number,
    year: number,
  ): Promise<Occurrence | null>
  update(occurrence: Occurrence): Promise<Occurrence>
}

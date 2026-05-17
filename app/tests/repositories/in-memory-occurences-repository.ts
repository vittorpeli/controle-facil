import type { UUID } from 'node:crypto'
import type { OccurrencesRepository } from '~/features/recurrences/application/ports/occurrences-repository'
import type { Occurrence } from '~/features/recurrences/core/occurrence'

export class InMemoryOccurencesRepository implements OccurrencesRepository {
  public items: Occurrence[] = []

  async create(occurrence: Occurrence): Promise<Occurrence> {
    this.items.push(occurrence)
    return occurrence
  }

  async findByRecurrenceIdAndDate(
    recurrenceId: UUID,
    month: number,
    year: number,
  ): Promise<Occurrence | null> {
    return (
      this.items.find(
        (occ) =>
          occ.recurrenceId === recurrenceId &&
          occ.referenceMonth === month &&
          occ.referenceYear === year,
      ) ?? null
    )
  }
}

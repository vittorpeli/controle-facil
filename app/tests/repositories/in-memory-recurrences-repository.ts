import type { UUID } from 'node:crypto'
import type { RecurrencesRepository } from '~/features/recurrences/application/ports/recurrences-repository'
import type { Recurrence } from '~/features/recurrences/core/recurrence'

export class InMemoryRecurrencesRepository implements RecurrencesRepository {
  public items: Recurrence[] = []

  async create(recurrence: Recurrence): Promise<Recurrence> {
    this.items.push(recurrence)
    return recurrence
  }

  async findById(id: UUID): Promise<Recurrence | null> {
    return this.items.find((r) => r.id === id) ?? null
  }

  async findAllByUserId(userId: UUID): Promise<Recurrence[]> {
    return this.items.filter((r) => r.userId === userId)
  }
}

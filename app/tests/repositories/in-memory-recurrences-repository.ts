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

  async update(recurrence: Recurrence): Promise<Recurrence> {
    const index = this.items.findIndex((r) => r.id === recurrence.id)
    if (index === -1) throw new Error('recurrence not found')
    this.items[index] = recurrence
    return recurrence
  }

  async delete(id: UUID): Promise<void> {
    const index = this.items.findIndex((r) => r.id === id)
    if (index === -1) throw new Error('recurrence not found')
    this.items.splice(index, 1)
  }
}

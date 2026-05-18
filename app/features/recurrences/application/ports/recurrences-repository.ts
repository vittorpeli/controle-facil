import type { UUID } from 'node:crypto'
import type { Recurrence } from '../../core/recurrence'

export interface RecurrencesRepository {
  create(recurrence: Recurrence): Promise<Recurrence>
  findById(id: UUID): Promise<Recurrence | null>
  findAllByUserId(userId: UUID): Promise<Recurrence[]>
}

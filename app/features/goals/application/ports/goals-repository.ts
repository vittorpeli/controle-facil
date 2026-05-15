import type { UUID } from 'node:crypto'
import type { Goal } from '../../core/goal'

export interface GoalsRepository {
  create(goal: Goal): Promise<Goal>
  findById(id: UUID): Promise<Goal | null>
  findAllByUserId(userId: UUID): Promise<Goal[]>
  update(goal: Goal): Promise<Goal>
  delete(id: UUID): Promise<void>
}

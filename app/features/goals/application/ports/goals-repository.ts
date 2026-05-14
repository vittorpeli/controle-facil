import type { Goal } from '../../core/goal'

export interface GoalsRepository {
  create(goal: Goal): Promise<Goal>
}

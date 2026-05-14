import type { GoalsRepository } from '~/features/goals/application/ports/goals-repository'
import type { Goal } from '~/features/goals/core/goal'

export class InMemoryGoalsRepository implements GoalsRepository {
  public items: Goal[] = []

  async create(goal: Goal): Promise<Goal> {
    this.items.push(goal)
    return goal
  }
}

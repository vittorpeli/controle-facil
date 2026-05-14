import type { UUID } from 'crypto'
import type { GoalsRepository } from '~/features/goals/application/ports/goals-repository'
import type { Goal } from '~/features/goals/core/goal'

export class InMemoryGoalsRepository implements GoalsRepository {
  public items: Goal[] = []

  async create(goal: Goal): Promise<Goal> {
    this.items.push(goal)
    return goal
  }

  async findById(id: UUID): Promise<Goal | null> {
    return this.items.find((g) => g.id === id) ?? null
  }

  async findAllByUserId(userId: UUID): Promise<Goal[]> {
    return this.items.filter((g) => g.userId === userId)
  }
}

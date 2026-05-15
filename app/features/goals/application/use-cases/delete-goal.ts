import type { UUID } from 'node:crypto'
import type { GoalsRepository } from '../ports/goals-repository'

interface DeleteGoalRequest {
  id: UUID
  userId: UUID
}

export const makeDeleteGoalUseCase = (goalsRepository: GoalsRepository) => {
  return async ({ id, userId }: DeleteGoalRequest): Promise<void> => {
    const goal = await goalsRepository.findById(id)

    if (!goal) throw new Error('Goal not found')
    if (goal.userId !== userId) throw new Error('Unauthorized')

    await goalsRepository.delete(goal.id)
  }
}

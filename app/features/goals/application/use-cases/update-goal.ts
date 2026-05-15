import type { UUID } from 'node:crypto'
import type { Goal } from '../../core/goal'
import type { GoalsRepository } from '../ports/goals-repository'

interface UpdateGoalRequest {
  id: UUID
  userId: UUID
  name?: string
  targetAmount?: number
  deadline?: Date
  description?: string | null
}

interface UpdateGoalResponse {
  goal: Goal
}

export const makeUpdateGoalUseCase = (goalsRepository: GoalsRepository) => {
  return async ({
    id,
    userId,
    name,
    targetAmount,
    deadline,
    description,
  }: UpdateGoalRequest): Promise<UpdateGoalResponse> => {
    const goal = await goalsRepository.findById(id)

    if (!goal) throw new Error('Goal not found')
    if (goal.userId !== userId) throw new Error('Unauthorized')

    const updatedGoal = await goalsRepository.update({
      ...goal,
      name: name ?? goal.name,
      targetAmount: targetAmount ?? goal.targetAmount,
      deadline: deadline ?? goal.deadline,
      description: description !== undefined ? description : goal.description,
    })

    return { goal: updatedGoal }
  }
}

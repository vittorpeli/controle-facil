import { randomUUID, type UUID } from 'node:crypto'
import type { Goal } from '../../core/goal'
import type { GoalsRepository } from '../ports/goals-repository'

interface CreateGoalRequest {
  userId: UUID
  name: string
  targetAmount: number
  deadline: Date
  description?: string | null
}

interface CreateGoalResponse {
  goal: Goal
}

export const makeCreateGoalUseCase = (goalsRepository: GoalsRepository) => {
  return async ({
    userId,
    name,
    targetAmount,
    deadline,
    description = null,
  }: CreateGoalRequest): Promise<CreateGoalResponse> => {
    if (deadline <= new Date()) {
      throw new Error('Deadline must be a future date')
    }

    const goal = await goalsRepository.create({
      id: randomUUID() as UUID,
      userId,
      name,
      targetAmount,
      deadline,
      description,
      createdAt: new Date(),
    })

    return { goal }
  }
}

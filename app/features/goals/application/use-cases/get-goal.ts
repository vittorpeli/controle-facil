import type { UUID } from 'node:crypto'
import type { GoalWithProgress } from '../../core/goal'
import { projectCompletion } from '../../services/project-completion'
import type { ContributionsRepository } from '../ports/contributions-repository'
import type { GoalsRepository } from '../ports/goals-repository'

interface GetGoalRequest {
  goalId: UUID
  userId: UUID
}

interface GetGoalResponse {
  goal: GoalWithProgress
}

export const makeGetGoalUseCase = (
  goalsRepository: GoalsRepository,
  contributionsRepository: ContributionsRepository,
) => {
  return async ({
    goalId,
    userId,
  }: GetGoalRequest): Promise<GetGoalResponse> => {
    const goal = await goalsRepository.findById(goalId)

    if (!goal) throw new Error('Goal not found')
    if (goal.userId !== userId) throw new Error('Unauthorized')

    const { totalContributed, monthlyAverage } =
      await contributionsRepository.getStatsByGoalId(goalId)

    const currentAmount = totalContributed
    const progress = (currentAmount / goal.targetAmount) * 100
    const isCompleted = currentAmount >= goal.targetAmount

    const projectedCompletionDate = projectCompletion(
      currentAmount,
      goal.targetAmount,
      monthlyAverage,
    )

    return {
      goal: {
        ...goal,
        currentAmount,
        progress,
        isCompleted,
        projectedCompletionDate,
      },
    }
  }
}

import type { UUID } from 'node:crypto'
import type { GoalWithProgress } from '../../core/goal'
import { projectCompletion } from '../../services/project-completion'
import type { ContributionsRepository } from '../ports/contributions-repository'
import type { GoalsRepository } from '../ports/goals-repository'

interface ListGoalsRequest {
  userId: UUID
}

interface ListGoalsResponse {
  goals: GoalWithProgress[]
}

export const makeListGoalsUseCase = (
  goalsRepository: GoalsRepository,
  contributionsRepository: ContributionsRepository,
) => {
  return async ({ userId }: ListGoalsRequest): Promise<ListGoalsResponse> => {
    const goals = await goalsRepository.findAllByUserId(userId)

    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const { totalContributed, monthlyAverage } =
          await contributionsRepository.getStatsByGoalId(goal.id)

        const currentAmount = totalContributed
        const progress = (currentAmount / goal.targetAmount) * 100
        const isCompleted = currentAmount >= goal.targetAmount

        const projectedCompletionDate = projectCompletion(
          currentAmount,
          goal.targetAmount,
          monthlyAverage,
        )

        return {
          ...goal,
          currentAmount,
          progress,
          isCompleted,
          projectedCompletionDate,
        }
      }),
    )

    return { goals: goalsWithProgress }
  }
}

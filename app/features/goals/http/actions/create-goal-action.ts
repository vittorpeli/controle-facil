import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeCreateGoalUseCase } from '../../application/use-cases/create-goal'
import { DrizzleGoalsRepository } from '../../services/drizzle-goals-repository'
import { createGoalSchema } from '../schema/create-goal-schema'

export async function createGoalAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: createGoalSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const goalsRepository = new DrizzleGoalsRepository()
  const createGoal = makeCreateGoalUseCase(goalsRepository)

  const { goal } = await createGoal({
    userId,
    name: submission.value.name,
    targetAmount: submission.value.targetAmount,
    deadline: submission.value.deadline,
    description: submission.value.description,
  })

  return Response.json({ success: true, goalId: goal.id })
}

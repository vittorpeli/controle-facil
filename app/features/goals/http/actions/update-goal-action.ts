import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeUpdateGoalUseCase } from '../../application/use-cases/update-goal'
import { DrizzleGoalsRepository } from '../../services/drizzle-goals-repository'
import { updateGoalSchema } from '../schema/update-goal-schema'

export async function updateGoalAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: updateGoalSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const goalsRepository = new DrizzleGoalsRepository()
  const updateGoal = makeUpdateGoalUseCase(goalsRepository)

  await updateGoal({
    userId,
    id: submission.value.goalId as UUID,
    name: submission.value.name,
    targetAmount: submission.value.targetAmount,
    deadline: submission.value.deadline,
    description: submission.value.description,
  })

  return Response.json({ success: true })
}

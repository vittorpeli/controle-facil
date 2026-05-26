import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeDeleteGoalUseCase } from '../../application/use-cases/delete-goal'
import { DrizzleGoalsRepository } from '../../services/drizzle-goals-repository'
import { deleteGoalSchema } from '../schema/delete-goal-schema'

export async function deleteGoalAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: deleteGoalSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const goalsRepository = new DrizzleGoalsRepository()
  const deleteGoal = makeDeleteGoalUseCase(goalsRepository)

  await deleteGoal({
    userId,
    id: submission.value.goalId as UUID,
  })

  return Response.json({ success: true, message: 'goal deleted' })
}

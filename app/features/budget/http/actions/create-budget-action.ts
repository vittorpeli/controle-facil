import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeCreateBudgetUseCase } from '../../application/use-cases/create-budget'
import { DrizzleBudgetsRepository } from '../../services/drizzle-budgets-repository'
import { createBudgetSchema } from '../schemas/create-budget-schema'

export async function createBudgetAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: createBudgetSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const budgetsRepository = new DrizzleBudgetsRepository()
  const createBudget = makeCreateBudgetUseCase(budgetsRepository)

  await createBudget({
    userId,
    categoryId: submission.value.categoryId as UUID,
    limitAmount: submission.value.limitAmount,
    month: submission.value.month,
    year: submission.value.year,
  })

  return Response.json({ success: true })
}

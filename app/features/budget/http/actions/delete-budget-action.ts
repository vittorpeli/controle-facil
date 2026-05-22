import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { redirect } from 'react-router'
import { makeDeleteBudgetUseCase } from '../../application/use-cases/delete-budget'
import { DrizzleBudgetsRepository } from '../../services/drizzle-budgets-repository'
import { deleteBudgetSchema } from '../schemas/delete-budget-schema'

export async function deleteBudgetAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: deleteBudgetSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const budgetsRepository = new DrizzleBudgetsRepository()
  const deleteBudget = makeDeleteBudgetUseCase(budgetsRepository)

  await deleteBudget({
    userId,
    budgetId: submission.value.budgetId as UUID,
  })

  return redirect('/budgets')
}

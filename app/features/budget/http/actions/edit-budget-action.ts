import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { redirect } from 'react-router'
import { makeEditBudgetUseCase } from '../../application/use-cases/edit-budget'
import { DrizzleBudgetsRepository } from '../../services/drizzle-budgets-repository'
import { editBudgetSchema } from '../schemas/edit-budget-schema'

export async function editBudgetAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: editBudgetSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const budgetsRepository = new DrizzleBudgetsRepository()
  const editBudget = makeEditBudgetUseCase(budgetsRepository)

  await editBudget({
    userId,
    budgetId: submission.value.budgetId as UUID,
    limitAmount: submission.value.limitAmount,
  })

  return redirect('/app/budgets')
}

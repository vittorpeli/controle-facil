import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { redirect } from 'react-router'
import { makeCopyBudgetUseCase } from '../../application/use-cases/copy-budget'
import { DrizzleBudgetsRepository } from '../../services/drizzle-budgets-repository'
import { copyBudgetSchema } from '../schemas/copy-budget-schema'

export async function copyBudgetAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: copyBudgetSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const budgetsRepository = new DrizzleBudgetsRepository()
  const copyBudget = makeCopyBudgetUseCase(budgetsRepository)

  await copyBudget({
    userId,
    month: submission.value.month,
    year: submission.value.year,
  })

  return redirect('/app/budgets')
}

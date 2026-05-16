import type { UUID } from 'node:crypto'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface DeleteBudgetRequest {
  budgetId: UUID
}

export const makeDeleteBudgetUseCase = (
  budgetsRepository: BudgetsRepository,
) => {
  return async ({ budgetId }: DeleteBudgetRequest): Promise<void> => {
    const budget = await budgetsRepository.findById(budgetId)
    if (!budget) throw new Error('budget do not exist')

    await budgetsRepository.delete(budget.id)
  }
}

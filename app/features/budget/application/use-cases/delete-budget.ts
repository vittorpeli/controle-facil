import type { UUID } from 'node:crypto'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface DeleteBudgetRequest {
  userId: UUID
  budgetId: UUID
}

export const makeDeleteBudgetUseCase = (
  budgetsRepository: BudgetsRepository,
) => {
  return async ({ userId, budgetId }: DeleteBudgetRequest): Promise<void> => {
    const budget = await budgetsRepository.findById(budgetId)
    if (!budget) throw new Error('budget do not exist')
    if (budget.userId !== userId) throw new Error('unauthorized')

    await budgetsRepository.delete(budget.id)
  }
}

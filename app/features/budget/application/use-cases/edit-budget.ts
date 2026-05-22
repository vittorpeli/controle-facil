import type { UUID } from 'node:crypto'
import type { Budget } from '../../core/budget'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface EditBudgetRequest {
  userId: UUID
  budgetId: UUID
  limitAmount: number
}

interface EditBudgetResponse {
  budget: Budget
}

export const makeEditBudgetUseCase = (budgetsRepository: BudgetsRepository) => {
  return async ({
    userId,
    budgetId,
    limitAmount,
  }: EditBudgetRequest): Promise<EditBudgetResponse> => {
    const budget = await budgetsRepository.findById(budgetId)

    if (!budget) throw new Error('budget not found')
    if (budget.userId !== userId) throw new Error('unauthorized')

    const updatedBudget = await budgetsRepository.update({
      ...budget,
      limitAmount: limitAmount ?? budget?.limitAmount,
    })

    return { budget: updatedBudget }
  }
}

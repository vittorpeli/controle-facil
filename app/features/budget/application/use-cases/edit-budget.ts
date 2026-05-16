import type { UUID } from 'node:crypto'
import type { Budget } from '../../core/budget'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface EditBudgetRequest {
  budgetId: UUID
  limitAmount: number
}

interface EditBudgetResponse {
  budget: Budget
}

export const makeEditBudgetUseCase = (budgetsRepository: BudgetsRepository) => {
  return async ({
    budgetId,
    limitAmount,
  }: EditBudgetRequest): Promise<EditBudgetResponse> => {
    const budget = await budgetsRepository.findById(budgetId)

    if (!budget) throw new Error('budget not found')

    const updatedBudget = await budgetsRepository.update({
      ...budget,
      limitAmount: limitAmount ?? budget?.limitAmount,
    })

    return { budget: updatedBudget }
  }
}

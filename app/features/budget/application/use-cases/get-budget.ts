import type { UUID } from 'node:crypto'
import type { Budget } from '../../core/budget'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface GetBudgetRequest {
  budgetId: UUID
  userId: UUID
}

interface GetBudgetResponse {
  budget: Budget
}

export const makeGetBudgetUseCase = (budgetsRepository: BudgetsRepository) => {
  return async ({
    budgetId,
    userId,
  }: GetBudgetRequest): Promise<GetBudgetResponse> => {
    const budget = await budgetsRepository.findById(budgetId)

    if (!budget) throw new Error('budget not found')
    if (budget.userId !== userId) throw new Error('unauthorized')

    return { budget }
  }
}

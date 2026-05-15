import { randomUUID, type UUID } from 'node:crypto'
import type { Budget } from '../../core/budget'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface CreateBudgetRequest {
  userId: UUID
  categoryId: UUID
  month: number
  year: number
  limitAmount: number
}

interface CreateBudgetResponse {
  budget: Budget
}

export const makeCreateBudgetUseCase = (
  budgetRepository: BudgetsRepository,
) => {
  return async ({
    userId,
    categoryId,
    month,
    year,
    limitAmount,
  }: CreateBudgetRequest): Promise<CreateBudgetResponse> => {
    if (limitAmount === 0) throw new Error('a budget must have a limit amount')
    if (limitAmount < 50)
      throw new Error('a budget must have a limit amount greater than 50')

    const existingBudget = await budgetRepository.findByCategoryMonthAndYear({
      userId,
      categoryId,
      month,
      year,
    })
    if (existingBudget)
      throw new Error('a budget already exists for this category in this month')

    const budget = await budgetRepository.create({
      id: randomUUID() as UUID,
      userId,
      categoryId,
      month,
      year,
      limitAmount,
      createdAt: new Date(),
    })

    return { budget }
  }
}

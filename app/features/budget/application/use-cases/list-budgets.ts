import type { UUID } from 'node:crypto'
import type { Budget } from '../../core/budget'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface ListBudgetsRequest {
  userId: UUID
  month?: number
  year?: number
}

interface ListBudgetsResponse {
  budgets: Budget[]
}

export const makeListBudgetsUseCase = (
  budgetsRepository: BudgetsRepository,
) => {
  return async ({
    userId,
    month,
    year,
  }: ListBudgetsRequest): Promise<ListBudgetsResponse> => {
    const allBudgets = await budgetsRepository.findAllByUserId(userId)

    const hasMonth = month !== undefined
    const hasYear = year !== undefined

    if ((hasMonth && !hasYear) || (!hasMonth && hasYear))
      throw new Error('month and year must be provided for filtering')

    const isFiltered = hasMonth && hasYear
    if (isFiltered) {
      const filteredBudgets = allBudgets.filter(
        (budget) => budget.month === month && budget.year === year,
      )
      return { budgets: filteredBudgets }
    }

    return { budgets: allBudgets }
  }
}

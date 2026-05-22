import type { UUID } from 'node:crypto'
import type { TransactionsRepository } from '~/features/transactions/application/ports/transactions-repository'
import type { BudgetProgress } from '../../core/budget'
import { getBudgetProgressStatus } from '../../services/get-budget-progress'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface GetBudgetRequest {
  userId: UUID
  month: number
  year: number
}

interface GetBudgetResponse {
  budgetProgresses: BudgetProgress[]
}

export const makeGetBudgetProgressUseCase = (
  budgetsRepository: BudgetsRepository,
  transactionsRepository: TransactionsRepository,
) => {
  return async ({
    userId,
    month,
    year,
  }: GetBudgetRequest): Promise<GetBudgetResponse> => {
    const budgets = await budgetsRepository.findAllByUserIdAndDate(
      userId,
      month,
      year,
    )

    const transactions = await transactionsRepository.findAllByUserIdAndDate(
      userId,
      month,
      year,
    )

    const transactionsSpentByCategory = new Map<UUID, number>()

    for (const transaction of transactions) {
      if (transaction.type !== 'expense') continue
      if (!transaction.categoryId) continue

      const currentSpent =
        transactionsSpentByCategory.get(transaction.categoryId) ?? 0

      transactionsSpentByCategory.set(
        transaction.categoryId,
        currentSpent + transaction.amount,
      )
    }

    const budgetProgresses = budgets.map((budget) => {
      const spentAmount =
        transactionsSpentByCategory.get(budget.categoryId) ?? 0
      const progressPercentage =
        budget.limitAmount > 0
          ? Math.round((spentAmount / budget.limitAmount) * 100)
          : 0

      const status = getBudgetProgressStatus(progressPercentage)

      return {
        ...budget,
        spentAmount,
        progressPercentage,
        status,
      }
    })

    return { budgetProgresses }
  }
}

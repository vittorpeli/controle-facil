import { randomUUID, type UUID } from 'node:crypto'
import type { BudgetsRepository } from '../ports/budgets-repository'

interface CopyBudgetRequest {
  userId: UUID
  month: number
  year: number
}

export const makeCopyBudgetUseCase = (budgetsRepository: BudgetsRepository) => {
  return async ({ userId, month, year }: CopyBudgetRequest): Promise<void> => {
    const previousMonth = month === 1 ? 12 : month - 1
    const previousMonthYear = month === 1 ? year - 1 : year

    const previousBudgets = await budgetsRepository.findAllByUserIdAndDate(
      userId,
      previousMonth,
      previousMonthYear,
    )

    for (const budget of previousBudgets) {
      const alreadyExists = await budgetsRepository.findByCategoryMonthAndYear({
        userId,
        categoryId: budget.categoryId,
        month,
        year,
      })

      if (alreadyExists) continue

      await budgetsRepository.create({
        ...budget,
        id: randomUUID() as UUID,
        month,
        year,
        createdAt: new Date(),
      })
    }
  }
}

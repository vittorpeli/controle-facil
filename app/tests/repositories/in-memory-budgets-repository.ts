import type { UUID } from 'node:crypto'
import type { BudgetsRepository } from '~/features/budget/application/ports/budgets-repository'
import type { Budget } from '~/features/budget/core/budget'

export class InMemoryBudgetsRepository implements BudgetsRepository {
  public items: Budget[] = []

  async create(budget: Budget): Promise<Budget> {
    this.items.push(budget)
    return budget
  }

  async findById(id: UUID): Promise<Budget | null> {
    return this.items.find((b) => b.id === id) ?? null
  }

  async findByCategoryMonthAndYear({
    userId,
    categoryId,
    month,
    year,
  }: {
    userId: UUID
    categoryId: UUID
    month: number
    year: number
  }): Promise<Budget | null> {
    const budget = this.items.find(
      (b) =>
        b.userId === userId &&
        b.categoryId === categoryId &&
        b.month === month &&
        b.year === year,
    )
    return budget ?? null
  }

  async findAllByUserId(userId: UUID): Promise<Budget[]> {
    return this.items.filter((b) => b.userId === userId)
  }

  async update(budget: Budget): Promise<Budget> {
    const index = this.items.findIndex((b) => b.id === budget.id)

    if (index === -1) throw new Error('budget not found')

    this.items[index] = budget
    return budget
  }

  async delete(id: UUID): Promise<void> {
    const index = this.items.findIndex((b) => b.id === id)
    if (index === -1) throw new Error('budget not found')
    this.items.splice(index, 1)
  }
}

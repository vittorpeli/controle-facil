import type { UUID } from 'node:crypto'
import type { Budget } from '../../core/budget'

export interface BudgetsRepository {
  create(budget: Budget): Promise<Budget>
  findById(id: UUID): Promise<Budget | null>
  findByCategoryMonthAndYear(data: {
    userId: UUID
    categoryId: UUID
    month: number
    year: number
  }): Promise<Budget | null>
  findAllByUserId(userId: UUID): Promise<Budget[]>
  update(budget: Budget): Promise<Budget>
  delete(id: UUID): Promise<void>
}

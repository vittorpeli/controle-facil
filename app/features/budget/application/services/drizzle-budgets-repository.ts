import type { UUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { budgets } from '~/lib/db/schema'
import type { Budget } from '../../core/budget'
import type { BudgetsRepository } from '../ports/budgets-repository'

function toDomain(row: typeof budgets.$inferSelect): Budget {
  return {
    id: row.id as UUID,
    userId: row.userId as UUID,
    categoryId: row.categoryId as UUID,
    month: row.month,
    year: row.year,
    limitAmount: row.limitAmount,
    createdAt: new Date(row.createdAt),
  }
}

export class DrizzleBudgetsRepository implements BudgetsRepository {
  async create(budget: Budget): Promise<Budget> {
    await db.insert(budgets).values({
      id: budget.id,
      userId: budget.id,
      categoryId: budget.categoryId,
      month: budget.month,
      year: budget.year,
      limitAmount: budget.limitAmount,
      createdAt: budget.createdAt.toISOString(),
    })
    return budget
  }

  async findById(id: UUID): Promise<Budget | null> {
    const budget = await db
      .select()
      .from(budgets)
      .where(eq(budgets.id, id))
      .get()
    return budget ? toDomain(budget) : null
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
    const budget = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.categoryId, categoryId),
          eq(budgets.month, month),
          eq(budgets.year, year),
        ),
      )
      .get()
    return budget ? toDomain(budget) : null
  }

  async findAllByUserId(userId: UUID): Promise<Budget[]> {
    const rows = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId))
      .all()
    return rows.map(toDomain)
  }

  async findAllByUserIdAndDate(
    userId: UUID,
    month: number,
    year: number,
  ): Promise<Budget[]> {
    const rows = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.month, month),
          eq(budgets.year, year),
        ),
      )
      .all()
    return rows.map(toDomain)
  }

  async update(budget: Budget): Promise<Budget> {
    await db.update(budgets).set({
      limitAmount: budget.limitAmount,
    })
    return budget
  }

  async delete(id: UUID): Promise<void> {
    await db.delete(budgets).where(eq(budgets.id, id))
  }
}

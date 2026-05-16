import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeBudget } from '~/tests/helpers'
import { InMemoryBudgetsRepository } from '~/tests/repositories/in-memory-budgets-repository'
import { makeEditBudgetUseCase } from './edit-budget'

const USER_ID = randomUUID() as UUID

let budgetsRepository: InMemoryBudgetsRepository
let sut: ReturnType<typeof makeEditBudgetUseCase>

describe('Get Budget Use Case', () => {
  beforeEach(() => {
    budgetsRepository = new InMemoryBudgetsRepository()
    sut = makeEditBudgetUseCase(budgetsRepository)
  })

  it('should edit the budget limit amount', async () => {
    const budget = await makeBudget(USER_ID, budgetsRepository)

    const { budget: updatedBudget } = await sut({
      budgetId: budget.id,
      limitAmount: 3000,
    })

    expect(updatedBudget.id).toBe(budget.id)
    expect(updatedBudget.limitAmount).toBe(3000)
    expect(updatedBudget.categoryId).toBe(budget.categoryId)
    expect(updatedBudget.userId).toBe(budget.userId)
    expect(updatedBudget.month).toBe(budget.month)
    expect(updatedBudget.year).toBe(budget.year)
  })

  it('should throw if the budget do not exists', async () => {
    await expect(
      sut({
        budgetId: randomUUID() as UUID,
        limitAmount: 3000,
      }),
    ).rejects.toThrow('budget not found')
  })
})

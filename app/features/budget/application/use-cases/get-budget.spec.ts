import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeBudget } from '~/tests/helpers'
import { InMemoryBudgetsRepository } from '~/tests/repositories/in-memory-budgets-repository'
import { makeGetBudgetUseCase } from './get-budget'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let budgetsRepository: InMemoryBudgetsRepository
let sut: ReturnType<typeof makeGetBudgetUseCase>

describe('Get Budget Use Case', () => {
  beforeEach(() => {
    budgetsRepository = new InMemoryBudgetsRepository()
    sut = makeGetBudgetUseCase(budgetsRepository)
  })

  it('should return the budget with all informations', async () => {
    const budget = await makeBudget(USER_ID, budgetsRepository)

    const { budget: result } = await sut({
      userId: USER_ID,
      budgetId: budget.id,
    })

    expect(result.id).toBe(budget.id)
    expect(result.categoryId).toBe(budget.categoryId)
    expect(result.userId).toBe(budget.userId)
    expect(result.limitAmount).toBe(budget.limitAmount)
    expect(result.month).toBe(budget.month)
    expect(result.year).toBe(budget.year)
  })

  it('should throw if budget do not exist', async () => {
    await expect(
      sut({
        budgetId: randomUUID() as UUID,
        userId: USER_ID,
      }),
    ).rejects.toThrow('budget not found')
  })

  it('should throw if budget belongs to another user', async () => {
    const budget = await makeBudget(USER_ID, budgetsRepository)

    await expect(
      sut({
        budgetId: budget.id,
        userId: OTHER_USER_ID,
      }),
    ).rejects.toThrow('unauthorized')
  })
})

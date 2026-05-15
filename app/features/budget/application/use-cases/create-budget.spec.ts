import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryBudgetsRepository } from '~/tests/repositories/in-memory-budgets-repository'
import { makeCreateBudgetUseCase } from './create-budget'

const USER_ID = randomUUID() as UUID
const CATEGORY_ID = randomUUID() as UUID

let budgetsRepository: InMemoryBudgetsRepository
let sut: ReturnType<typeof makeCreateBudgetUseCase>

describe('Create budget Use Case', () => {
  beforeEach(() => {
    budgetsRepository = new InMemoryBudgetsRepository()
    sut = makeCreateBudgetUseCase(budgetsRepository)
  })

  it('should be able to create a new budget', async () => {
    const { budget } = await sut({
      userId: USER_ID,
      categoryId: CATEGORY_ID,
      month: 6,
      year: 2026,
      limitAmount: 5000,
    })

    expect(budget.userId).toBe(USER_ID)
    expect(budget.categoryId).toBe(CATEGORY_ID)
    expect(budget.month).toBe(6)
    expect(budget.year).toBe(2026)
    expect(budget.limitAmount).toBe(5000)
    expect(budgetsRepository.items).toHaveLength(1)
  })

  it('should generate a unique id for each budget', async () => {
    const { budget: b1 } = await sut({
      userId: USER_ID,
      categoryId: CATEGORY_ID,
      month: 6,
      year: 2026,
      limitAmount: 5000,
    })
    const { budget: b2 } = await sut({
      userId: USER_ID,
      categoryId: CATEGORY_ID,
      month: 7,
      year: 2026,
      limitAmount: 10_000,
    })

    expect(b1.id).not.toBe(b2.id)
  })

  it('should not create a budget with no limit amount', async () => {
    await expect(
      sut({
        userId: USER_ID,
        categoryId: CATEGORY_ID,
        month: 6,
        year: 2026,
        limitAmount: 0,
      }),
    ).rejects.toThrow('a budget must have a limit amount')
  })

  it('should not create a budget with limit amount less than 50', async () => {
    await expect(
      sut({
        userId: USER_ID,
        categoryId: CATEGORY_ID,
        month: 6,
        year: 2026,
        limitAmount: 1,
      }),
    ).rejects.toThrow('a budget must have a limit amount greater than 50')
  })

  it('should be able to create only one budget for category per month', async () => {
    await sut({
      userId: USER_ID,
      categoryId: CATEGORY_ID,
      month: 6,
      year: 2026,
      limitAmount: 5000,
    })

    await expect(
      sut({
        userId: USER_ID,
        categoryId: CATEGORY_ID,
        month: 6,
        year: 2026,
        limitAmount: 10000,
      }),
    ).rejects.toThrow('a budget already exists for this category in this month')
  })
})

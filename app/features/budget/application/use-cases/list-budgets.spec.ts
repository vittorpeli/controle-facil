import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeBudget } from '~/tests/helpers'
import { InMemoryBudgetsRepository } from '~/tests/repositories/in-memory-budgets-repository'
import { makeListBudgetsUseCase } from './list-budgets'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let budgetsRepository: InMemoryBudgetsRepository
let sut: ReturnType<typeof makeListBudgetsUseCase>

describe('List Budgets Use Case', () => {
  beforeEach(() => {
    budgetsRepository = new InMemoryBudgetsRepository()
    sut = makeListBudgetsUseCase(budgetsRepository)
  })

  it('should return an empty array when the user has no budgets', async () => {
    const { budgets } = await sut({ userId: USER_ID })
    expect(budgets).toHaveLength(0)
  })

  it('should return all budgets belonging to the user', async () => {
    await makeBudget(USER_ID, budgetsRepository)
    await makeBudget(USER_ID, budgetsRepository, {
      month: 7,
      year: 2026,
      limitAmount: 6000,
    })

    const { budgets } = await sut({
      userId: USER_ID,
    })

    expect(budgets).toHaveLength(2)
    expect(budgets[0].month).toBe(6)
    expect(budgets[1].month).toBe(7)
  })

  it('should be able to filter budgets from this month', async () => {
    await makeBudget(USER_ID, budgetsRepository)
    await makeBudget(USER_ID, budgetsRepository, {
      month: 7,
      year: 2026,
      limitAmount: 6000,
    })

    const { budgets } = await sut({
      userId: USER_ID,
      month: 6,
      year: 2026,
    })

    expect(budgets).toHaveLength(1)
    expect(budgets[0].month).toBe(6)
  })

  it('should throw an error if only the month is provided', async () => {
    await expect(
      sut({
        userId: USER_ID,
        month: 6,
      }),
    ).rejects.toThrow('month and year must be provided for filtering')
  })

  it('should throw an error if only the year is provided', async () => {
    await expect(
      sut({
        userId: USER_ID,
        year: 2026,
      }),
    ).rejects.toThrow('month and year must be provided for filtering')
  })

  it('should not return budgets from other users', async () => {
    await makeBudget(USER_ID, budgetsRepository)
    await makeBudget(OTHER_USER_ID, budgetsRepository)

    const { budgets } = await sut({
      userId: USER_ID,
    })

    expect(budgets).toHaveLength(1)
    expect(budgets[0].userId).toBe(USER_ID)
  })
})

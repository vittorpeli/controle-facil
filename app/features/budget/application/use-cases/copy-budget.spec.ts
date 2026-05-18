import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeBudget } from '~/tests/helpers'
import { InMemoryBudgetsRepository } from '~/tests/repositories/in-memory-budgets-repository'
import { makeCopyBudgetUseCase } from './copy-budget'

const USER_ID = randomUUID() as UUID
const CATEGORY_ID = randomUUID() as UUID

let budgetsRepository: InMemoryBudgetsRepository
let sut: ReturnType<typeof makeCopyBudgetUseCase>

describe('Copy Budget Use Case', () => {
  beforeEach(() => {
    budgetsRepository = new InMemoryBudgetsRepository()
    sut = makeCopyBudgetUseCase(budgetsRepository)
  })

  it('should copy budget from previous month', async () => {
    await makeBudget(USER_ID, budgetsRepository, {
      categoryId: randomUUID() as UUID,
      month: 4,
      year: 2026,
      limitAmount: 500,
    })
    await makeBudget(USER_ID, budgetsRepository, {
      categoryId: randomUUID() as UUID,
      month: 4,
      year: 2026,
      limitAmount: 300,
    })

    await sut({
      userId: USER_ID,
      month: 5,
      year: 2026,
    })

    const budgets = await budgetsRepository.findAllByUserIdAndDate(
      USER_ID,
      5,
      2026,
    )

    expect(budgets).toHaveLength(2)

    expect(budgets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          limitAmount: 500,
        }),
        expect.objectContaining({
          limitAmount: 300,
        }),
      ]),
    )
  })

  it('should not duplicate existing categories', async () => {
    await makeBudget(USER_ID, budgetsRepository, {
      categoryId: CATEGORY_ID,
      month: 4,
      year: 2026,
      limitAmount: 500,
    })

    await makeBudget(USER_ID, budgetsRepository, {
      categoryId: CATEGORY_ID,
      month: 5,
      year: 2026,
      limitAmount: 800,
    })

    await sut({
      userId: USER_ID,
      month: 5,
      year: 2026,
    })

    const budgets = await budgetsRepository.findAllByUserIdAndDate(
      USER_ID,
      5,
      2026,
    )

    expect(budgets).toHaveLength(1)

    expect(budgets[0]).toEqual(
      expect.objectContaining({
        limitAmount: 800,
      }),
    )
  })

  it('should copy budgets from december of previous year', async () => {
    await makeBudget(USER_ID, budgetsRepository, {
      categoryId: CATEGORY_ID,
      month: 12,
      year: 2025,
      limitAmount: 500,
    })

    await sut({
      userId: USER_ID,
      month: 1,
      year: 2026,
    })

    const budgets = await budgetsRepository.findAllByUserIdAndDate(
      USER_ID,
      1,
      2026,
    )

    expect(budgets).toHaveLength(1)

    expect(budgets[0]).toEqual(
      expect.objectContaining({
        categoryId: CATEGORY_ID,
        limitAmount: 500,
        month: 1,
        year: 2026,
      }),
    )
  })

  it('should not fail when previous month has no budgets', async () => {
    await expect(
      sut({
        userId: USER_ID,
        month: 5,
        year: 2026,
      }),
    ).resolves.not.toThrow()
  })
})

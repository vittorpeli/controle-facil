import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeBudget } from '~/tests/helpers'
import { InMemoryBudgetsRepository } from '~/tests/repositories/in-memory-budgets-repository'
import { makeDeleteBudgetUseCase } from './delete-budget'

const USER_ID = randomUUID() as UUID

let budgetsRepository: InMemoryBudgetsRepository
let sut: ReturnType<typeof makeDeleteBudgetUseCase>

describe('Delete Budget Use Case', () => {
  beforeEach(() => {
    budgetsRepository = new InMemoryBudgetsRepository()
    sut = makeDeleteBudgetUseCase(budgetsRepository)
  })

  it('should delete a budget', async () => {
    const budget = await makeBudget(USER_ID, budgetsRepository)

    await sut({
      budgetId: budget.id,
    })

    expect(budgetsRepository.items).toHaveLength(0)
  })

  it('should throw if the budget do not exists', async () => {
    await expect(
      sut({
        budgetId: randomUUID() as UUID,
      }),
    ).rejects.toThrow('budget do not exist')
  })
})

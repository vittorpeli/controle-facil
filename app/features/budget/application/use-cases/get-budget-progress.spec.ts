import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeBudget, makeCategory, makeTransaction } from '~/tests/helpers'
import { InMemoryBudgetsRepository } from '~/tests/repositories/in-memory-budgets-repository'
import { InMemoryCategoriesRepository } from '~/tests/repositories/in-memory-categories-repository'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeGetBudgetProgressUseCase } from './get-budget-progress'

const USER_ID = randomUUID() as UUID

let budgetsRepository: InMemoryBudgetsRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: ReturnType<typeof makeGetBudgetProgressUseCase>

describe('Get Budget Progress Use Case', () => {
  beforeEach(() => {
    budgetsRepository = new InMemoryBudgetsRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = makeGetBudgetProgressUseCase(
      budgetsRepository,
      transactionsRepository,
    )
  })

  it('should be able to get the budget progress', async () => {
    const category = await makeCategory(new InMemoryCategoriesRepository(), {
      userId: USER_ID,
    })
    const budget = await makeBudget(USER_ID, budgetsRepository, {
      limitAmount: 1000,
      categoryId: category.id,
    })

    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 200,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 300,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })

    const { budgetProgresses } = await sut({
      userId: USER_ID,
      month: budget.month,
      year: budget.year,
    })

    expect(budgetProgresses).toHaveLength(1)
    expect(budgetProgresses[0].spentAmount).toBe(500)
    expect(budgetProgresses[0].progressPercentage).toBe(50)
    expect(budgetProgresses[0].status).toBe('safe')
  })

  it('should return warning status when budget usage is between 80 and 100 percent', async () => {
    const category = await makeCategory(new InMemoryCategoriesRepository(), {
      userId: USER_ID,
    })
    const budget = await makeBudget(USER_ID, budgetsRepository, {
      limitAmount: 1000,
      categoryId: category.id,
    })

    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 400,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 450,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })

    const { budgetProgresses } = await sut({
      userId: USER_ID,
      month: budget.month,
      year: budget.year,
    })

    expect(budgetProgresses[0].spentAmount).toBe(850)
    expect(budgetProgresses[0].progressPercentage).toBe(85)
    expect(budgetProgresses[0].status).toBe('warning')
  })

  it('should return danger status when budget is exceeded', async () => {
    const category = await makeCategory(new InMemoryCategoriesRepository(), {
      userId: USER_ID,
    })
    const budget = await makeBudget(USER_ID, budgetsRepository, {
      limitAmount: 1000,
      categoryId: category.id,
    })

    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 500,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 700,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })

    const { budgetProgresses } = await sut({
      userId: USER_ID,
      month: budget.month,
      year: budget.year,
    })

    expect(budgetProgresses[0].spentAmount).toBe(1200)
    expect(budgetProgresses[0].progressPercentage).toBe(120)
    expect(budgetProgresses[0].status).toBe('danger')
  })

  it('should ignore transactions from other months', async () => {
    const category = await makeCategory(new InMemoryCategoriesRepository(), {
      userId: USER_ID,
    })

    await makeBudget(USER_ID, budgetsRepository, { month: 5 })
    await makeBudget(USER_ID, budgetsRepository, { month: 4 })

    const budget = await makeBudget(USER_ID, budgetsRepository, {
      limitAmount: 1000,
      categoryId: category.id,
      month: 6,
    })

    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 500,
      categoryId: category.id,
      date: new Date(2026, 4, 1),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 500,
      categoryId: category.id,
      date: new Date(2026, 3, 1),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 500,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })

    const { budgetProgresses } = await sut({
      userId: USER_ID,
      month: budget.month,
      year: budget.year,
    })

    expect(budgetProgresses[0].spentAmount).toBe(500)
  })

  it('should ignore income transactions', async () => {
    const category = await makeCategory(new InMemoryCategoriesRepository(), {
      userId: USER_ID,
    })

    const budget = await makeBudget(USER_ID, budgetsRepository, {
      limitAmount: 1000,
      categoryId: category.id,
      month: 6,
    })

    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 500,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })

    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'income',
      amount: 600,
      categoryId: category.id,
      date: new Date(2026, 5, 1),
    })

    const { budgetProgresses } = await sut({
      userId: USER_ID,
      month: budget.month,
      year: budget.year,
    })

    expect(budgetProgresses[0].spentAmount).toBe(500)
  })
})

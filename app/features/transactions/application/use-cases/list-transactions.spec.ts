import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAccount, makeTransaction } from '~/tests/helpers'
import { InMemoryAccountsRepository } from '~/tests/repositories/in-memory-accounts-repository'
import { InMemoryCategoriesRepository } from '~/tests/repositories/in-memory-categories-repository'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeListTransactionsUseCase } from './list-transactions'

const USER_ID = randomUUID() as UUID

let transactionsRepository: InMemoryTransactionsRepository
let categoriesRepository: InMemoryCategoriesRepository
let sut: ReturnType<typeof makeListTransactionsUseCase>

describe('List Transactions Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    transactionsRepository = new InMemoryTransactionsRepository(
      categoriesRepository,
    )
    sut = makeListTransactionsUseCase(transactionsRepository)
  })

  it('should list all transactions from user', async () => {
    await makeTransaction(USER_ID, transactionsRepository)
    await makeTransaction(USER_ID, transactionsRepository)
    await makeTransaction(USER_ID, transactionsRepository)

    const { transactions } = await sut({ userId: USER_ID })

    expect(transactions).toHaveLength(3)
  })

  it('should return transactions ordered by date descending', async () => {
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2025, 0, 1),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2025, 2, 1),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2025, 1, 1),
    })

    const { transactions } = await sut({ userId: USER_ID })

    expect(transactions[0].date).toEqual(new Date(2025, 2, 1))
    expect(transactions[1].date).toEqual(new Date(2025, 1, 1))
    expect(transactions[2].date).toEqual(new Date(2025, 0, 1))
  })

  it('should return an empty array when the user has no transactions', async () => {
    const { transactions } = await sut({ userId: USER_ID })
    expect(transactions).toHaveLength(0)
  })

  // Filtros

  it('should filter transactions by account', async () => {
    const account = await makeAccount(USER_ID, new InMemoryAccountsRepository())
    const otherId = randomUUID() as UUID

    await makeTransaction(USER_ID, transactionsRepository, {
      accountId: otherId,
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      accountId: account.id,
      type: 'expense',
      amount: 800,
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      accountId: account.id,
      type: 'expense',
      amount: 200,
    })

    const { transactions } = await sut({
      userId: USER_ID,
      accountId: account.id,
    })

    expect(transactions).toHaveLength(2)

    transactions.forEach((transaction) => {
      expect(transaction.accountId).toBe(account.id)
    })
  })

  it('should filter transactions by type', async () => {
    await makeTransaction(USER_ID, transactionsRepository, { type: 'income' })
    await makeTransaction(USER_ID, transactionsRepository, { type: 'expense' })
    await makeTransaction(USER_ID, transactionsRepository, { type: 'expense' })

    const { transactions } = await sut({
      userId: USER_ID,
      type: 'expense',
    })

    expect(transactions).toHaveLength(2)
    transactions.forEach((transaction) => {
      expect(transaction.type).toBe('expense')
    })
  })

  it('should filter transactions by multiple types simultaneosly', async () => {
    await makeTransaction(USER_ID, transactionsRepository, { type: 'income' })
    await makeTransaction(USER_ID, transactionsRepository, { type: 'expense' })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'contribution',
    })

    const { transactions } = await sut({
      userId: USER_ID,
      type: ['expense', 'contribution'],
    })

    expect(transactions).toHaveLength(2)
    transactions.forEach((transaction) => {
      expect(['expense', 'contribution']).toContain(transaction.type)
    })
  })

  it('should filter transactions by category', async () => {
    const categoryId = randomUUID() as UUID
    const otherCategoryId = randomUUID() as UUID

    await makeTransaction(USER_ID, transactionsRepository, { categoryId })
    await makeTransaction(USER_ID, transactionsRepository, { categoryId })
    await makeTransaction(USER_ID, transactionsRepository, {
      categoryId: otherCategoryId,
    })

    const { transactions } = await sut({ userId: USER_ID, categoryId })

    expect(transactions).toHaveLength(2)
    transactions.forEach((t) => {
      expect(t.categoryId).toBe(categoryId)
    })
  })

  it('should filter transactions by month and year', async () => {
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2025, 0, 10),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2025, 0, 20),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2025, 1, 5),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2024, 0, 10),
    })

    const { transactions } = await sut({
      userId: USER_ID,
      month: 1,
      year: 2025,
    })

    expect(transactions).toHaveLength(2)
    transactions.forEach((t) => {
      expect(t.date.getMonth() + 1).toBe(1)
      expect(t.date.getFullYear()).toBe(2025)
    })
  })

  it('should filter transactions by year only', async () => {
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2025, 0, 1),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2025, 11, 31),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      date: new Date(2024, 6, 1),
    })

    const { transactions } = await sut({ userId: USER_ID, year: 2025 })

    expect(transactions).toHaveLength(2)
    transactions.forEach((t) => {
      expect(t.date.getFullYear()).toBe(2025)
    })
  })

  it('should apply multiple filters in combination', async () => {
    const accountId = randomUUID() as UUID

    await makeTransaction(USER_ID, transactionsRepository, {
      accountId,
      type: 'expense',
      date: new Date(2025, 0, 10),
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      accountId,
      type: 'income',
      date: new Date(2025, 0, 15), // tipo diferente
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      accountId,
      type: 'expense',
      date: new Date(2025, 1, 10), // mês diferente
    })

    const { transactions } = await sut({
      userId: USER_ID,
      accountId,
      type: 'expense',
      month: 1,
      year: 2025,
    })

    expect(transactions).toHaveLength(1)
    expect(transactions[0].type).toBe('expense')
    expect(transactions[0].date.getMonth()).toBe(0) // janeiro
  })

  // Totais
  it('should return zero totals when there are no transactions', async () => {
    const { totals } = await sut({ userId: USER_ID })

    expect(totals.income).toBe(0)
    expect(totals.expense).toBe(0)
    expect(totals.balance).toBe(0)
  })

  it('should calculate totals from filtered transactions', async () => {
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'income',
      amount: 5_000,
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'income',
      amount: 2_000,
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 1_500,
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'expense',
      amount: 500,
    })

    const { totals } = await sut({ userId: USER_ID })

    expect(totals.income).toBe(7_000)
    expect(totals.expense).toBe(2_000)
    expect(totals.balance).toBe(5_000)
  })

  it('should compute totals only from the filtered period', async () => {
    // Janeiro — inclui
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'income',
      amount: 3_000,
      date: new Date(2025, 0, 1),
    })
    // Fevereiro — deve ser ignorado com filtro de janeiro
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'income',
      amount: 9_999,
      date: new Date(2025, 1, 1),
    })

    const { totals } = await sut({ userId: USER_ID, month: 1, year: 2025 })

    expect(totals.income).toBe(3_000)
  })

  it('should count transfer_in as income and transfer_out as expense in totals', async () => {
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'transfer_in',
      amount: 1_000,
    })
    await makeTransaction(USER_ID, transactionsRepository, {
      type: 'transfer_out',
      amount: 500,
    })

    const { totals } = await sut({ userId: USER_ID })

    expect(totals.income).toBe(1_000)
    expect(totals.expense).toBe(500)
  })
})

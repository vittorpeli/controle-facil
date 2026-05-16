import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAccount } from '~/tests/helpers'
import { InMemoryAccountsRepository } from '~/tests/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeCreateTransactionUseCase } from './create-transaction'

const USER_ID = randomUUID() as UUID

let accountsRepository: InMemoryAccountsRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: ReturnType<typeof makeCreateTransactionUseCase>

describe('Create Transaction Use Case', () => {
  beforeEach(() => {
    accountsRepository = new InMemoryAccountsRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = makeCreateTransactionUseCase(
      accountsRepository,
      transactionsRepository,
    )
  })

  it('should create a income transaction', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    const { transaction } = await sut({
      userId: USER_ID,
      accountId: account.id,
      type: 'income',
      amount: 5000,
      date: new Date('2026-04-01'),
      categoryId: randomUUID() as UUID,
      description: 'Salário',
    })

    expect(transaction.type).toBe('income')
    expect(transactionsRepository.items).toHaveLength(1)
    expect(transaction.accountId).toBe(account.id)
    expect(transaction.amount).toBe(5000)
    expect(transaction.description).toBe('Salário')
  })

  it('should create a expense transaction', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    const { transaction } = await sut({
      userId: USER_ID,
      accountId: account.id,
      type: 'expense',
      amount: 500,
      date: new Date('2026-04-01'),
      categoryId: randomUUID() as UUID,
      description: 'Mercado',
    })

    expect(transaction.type).toBe('expense')
    expect(transactionsRepository.items).toHaveLength(1)
    expect(transaction.accountId).toBe(account.id)
    expect(transaction.amount).toBe(500)
    expect(transaction.description).toBe('Mercado')
  })

  it('should update the account balance after transaction', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    await sut({
      userId: USER_ID,
      accountId: account.id,
      type: 'income',
      amount: 5000,
      categoryId: randomUUID() as UUID,
    })

    await sut({
      userId: USER_ID,
      accountId: account.id,
      type: 'expense',
      amount: 500,
      categoryId: randomUUID() as UUID,
    })

    const balance = await transactionsRepository.getBalanceByAccountId(
      account.id,
    )

    expect(balance).toBe(4500)
  })

  it('should set date as today when not provided', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)
    const now = new Date()

    const { transaction } = await sut({
      userId: USER_ID,
      accountId: account.id,
      type: 'income',
      amount: 5000,
      categoryId: randomUUID() as UUID,
    })

    expect(transaction.date).toEqual(now)
  })

  it('should set description as null when not provided', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    const { transaction } = await sut({
      userId: USER_ID,
      accountId: account.id,
      type: 'income',
      amount: 5000,
      date: new Date('2026-04-01'),
      categoryId: randomUUID() as UUID,
    })

    expect(transaction.description).toBeNull()
  })

  it('should throw if a transaction do not have a value', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        accountId: account.id,
        type: 'income',
        amount: 0,
        date: new Date('2026-04-01'),
        categoryId: randomUUID() as UUID,
      }),
    ).rejects.toThrow('transaction amount must be greater than 0')
  })
})

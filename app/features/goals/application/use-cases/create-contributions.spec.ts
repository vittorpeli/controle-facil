// app/features/goals/application/use-cases/create-contribution.spec.ts
import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAccount, makeGoal } from '~/tests/helpers'
import { InMemoryAccountsRepository } from '~/tests/repositories/in-memory-accounts-repository'
import { InMemoryGoalsRepository } from '~/tests/repositories/in-memory-goals-repository'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeCreateContributionUseCase } from './create-contributions'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let goalsRepository: InMemoryGoalsRepository
let accountsRepository: InMemoryAccountsRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: ReturnType<typeof makeCreateContributionUseCase>

describe('Create Contribution Use Case', () => {
  beforeEach(() => {
    goalsRepository = new InMemoryGoalsRepository()
    accountsRepository = new InMemoryAccountsRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = makeCreateContributionUseCase(
      goalsRepository,
      accountsRepository,
      transactionsRepository,
    )
  })

  it('should create a transaction of type contribution', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    const { transaction } = await sut({
      userId: USER_ID,
      goalId: goal.id,
      accountId: account.id,
      amount: 500,
      date: new Date(2025, 0, 1),
    })

    expect(transaction.type).toBe('contribution')
  })

  it('should persist the transaction', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    await sut({
      userId: USER_ID,
      goalId: goal.id,
      accountId: account.id,
      amount: 500,
      date: new Date(),
    })

    expect(transactionsRepository.transactions).toHaveLength(1)
  })

  it('should link the transaction to the goal via goalId', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    const { transaction } = await sut({
      userId: USER_ID,
      goalId: goal.id,
      accountId: account.id,
      amount: 500,
      date: new Date(),
    })

    expect(transaction.goalId).toBe(goal.id)
  })

  it('should link the transaction to the source account', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    const { transaction } = await sut({
      userId: USER_ID,
      goalId: goal.id,
      accountId: account.id,
      amount: 500,
      date: new Date(),
    })

    expect(transaction.accountId).toBe(account.id)
  })

  it('should propagate description to the transaction', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    const { transaction } = await sut({
      userId: USER_ID,
      goalId: goal.id,
      accountId: account.id,
      amount: 500,
      date: new Date(),
      description: 'Aporte mensal',
    })

    expect(transaction.description).toBe('Aporte mensal')
  })

  it('should set description as null when not provided', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    const { transaction } = await sut({
      userId: USER_ID,
      goalId: goal.id,
      accountId: account.id,
      amount: 500,
      date: new Date(),
    })

    expect(transaction.description).toBeNull()
  })

  // ─── Efeitos ─────────────────────────────────────────────────────────────

  it('should debit the source account balance', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    // Seed de saldo inicial
    transactionsRepository.items.push({
      accountId: account.id,
      type: 'income',
      amount: 2_000,
    })

    await sut({
      userId: USER_ID,
      goalId: goal.id,
      accountId: account.id,
      amount: 500,
      date: new Date(),
    })

    const balance = await transactionsRepository.getBalanceByAccountId(
      account.id,
    )
    expect(balance).toBe(1_500)
  })

  it('should increase goal progress after contribution', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository, {
      targetAmount: 10_000,
    })
    const account = await makeAccount(USER_ID, accountsRepository)

    await sut({
      userId: USER_ID,
      goalId: goal.id,
      accountId: account.id,
      amount: 2_500,
      date: new Date(),
    })

    // Verifica que a transação foi criada com goalId correto
    const contribution = transactionsRepository.transactions[0]
    expect(contribution.goalId).toBe(goal.id)
    expect(contribution.amount).toBe(2_500)
  })

  // ─── Validações ──────────────────────────────────────────────────────────

  it('should throw if amount is zero', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        goalId: goal.id,
        accountId: account.id,
        amount: 0,
        date: new Date(),
      }),
    ).rejects.toThrow('amount must be greater than zero')
  })

  it('should throw if amount is negative', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        goalId: goal.id,
        accountId: account.id,
        amount: -100,
        date: new Date(),
      }),
    ).rejects.toThrow('amount must be greater than zero')
  })

  it('should throw if goal does not exist', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        goalId: randomUUID() as UUID,
        accountId: account.id,
        amount: 500,
        date: new Date(),
      }),
    ).rejects.toThrow('goal not found')
  })

  it('should throw if goal belongs to another user', async () => {
    const goal = await makeGoal(OTHER_USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        goalId: goal.id,
        accountId: account.id,
        amount: 500,
        date: new Date(),
      }),
    ).rejects.toThrow('unauthorized')
  })

  it('should throw if account does not exist', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    await expect(
      sut({
        userId: USER_ID,
        goalId: goal.id,
        accountId: randomUUID() as UUID,
        amount: 500,
        date: new Date(),
      }),
    ).rejects.toThrow('account not found')
  })

  it('should throw if account belongs to another user', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(OTHER_USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        goalId: goal.id,
        accountId: account.id,
        amount: 500,
        date: new Date(),
      }),
    ).rejects.toThrow('unauthorized')
  })

  it('should throw if account is archived', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const account = await makeAccount(USER_ID, accountsRepository, {
      isArchived: true,
    })

    await expect(
      sut({
        userId: USER_ID,
        goalId: goal.id,
        accountId: account.id,
        amount: 500,
        date: new Date(),
      }),
    ).rejects.toThrow('account is archived')
  })
})

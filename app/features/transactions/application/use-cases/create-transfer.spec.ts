import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAccount } from '~/tests/helpers'
import { InMemoryAccountsRepository } from '~/tests/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeCreateTransferUseCase } from './create-transfer'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let accountsRepository: InMemoryAccountsRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: ReturnType<typeof makeCreateTransferUseCase>

describe('Create Transfer Use Case', () => {
  beforeEach(() => {
    accountsRepository = new InMemoryAccountsRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = makeCreateTransferUseCase(accountsRepository, transactionsRepository)
  })

  it('should create two transactions: transfer_out and transfer_in', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    const { outbound, inbound } = await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 500,
      date: new Date('2025-01-15'),
      description: 'Transferência',
    })

    expect(outbound.type).toBe('transfer_out')
    expect(inbound.type).toBe('transfer_in')
  })

  it('should persist both transactions', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 500,
      date: new Date(),
      description: 'Transferência',
    })

    expect(transactionsRepository.transactions).toHaveLength(2)
  })

  it('should link both transactions with the same transferGroupId', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    const { outbound, inbound } = await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 500,
      date: new Date(),
      description: 'Transferência',
    })

    expect(outbound.transferGroupId).toBeDefined()
    expect(outbound.transferGroupId).toBe(inbound.transferGroupId)
  })

  it('should generate unique transferGroupIds for different transfers', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    const { outbound: t1 } = await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 100,
      date: new Date(),
      description: 'Transferência',
    })
    const { outbound: t2 } = await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 200,
      date: new Date(),
      description: 'Transferência',
    })

    expect(t1.transferGroupId).not.toBe(t2.transferGroupId)
  })

  it('should set the correct accountId on each transaction', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    const { outbound, inbound } = await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 500,
      date: new Date(),
      description: 'Transferência',
    })

    expect(outbound.accountId).toBe(from.id)
    expect(inbound.accountId).toBe(to.id)
  })

  it('should set the same amount on both transactions', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    const { outbound, inbound } = await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 750,
      date: new Date(),
      description: 'Transferência',
    })

    expect(outbound.amount).toBe(750)
    expect(inbound.amount).toBe(750)
  })

  it('should set the same date on both transactions', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)
    const date = new Date('2025-06-01')

    const { outbound, inbound } = await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 500,
      date,
      description: 'Transferência',
    })

    expect(outbound.date).toEqual(date)
    expect(inbound.date).toEqual(date)
  })

  it('should propagate the description to both transactions', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    const { outbound, inbound } = await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 500,
      date: new Date(),
      description: 'Reserva de emergência',
    })

    expect(outbound.description).toBe('Reserva de emergência')
    expect(inbound.description).toBe('Reserva de emergência')
  })

  // ─── Saldos ──────────────────────────────────────────────────────────────

  it('should reduce the balance of the source account', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    // Seed saldo inicial na conta de origem
    transactionsRepository.items.push({
      accountId: from.id,
      type: 'income',
      amount: 2000,
    })

    await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 500,
      date: new Date(),
      description: 'Transferência',
    })

    const balance = await transactionsRepository.getBalanceByAccountId(from.id)
    expect(balance).toBe(1500)
  })

  it('should increase the balance of the destination account', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    transactionsRepository.items.push({
      accountId: from.id,
      type: 'income',
      amount: 2000,
    })

    await sut({
      userId: USER_ID,
      fromAccountId: from.id,
      toAccountId: to.id,
      amount: 500,
      date: new Date(),
      description: 'Transferência',
    })

    const balance = await transactionsRepository.getBalanceByAccountId(to.id)
    expect(balance).toBe(500)
  })

  // ─── Validações ──────────────────────────────────────────────────────────

  it('should throw if source account does not exist', async () => {
    const to = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        fromAccountId: randomUUID() as UUID,
        toAccountId: to.id,
        amount: 500,
        date: new Date(),
        description: 'Transferência',
      }),
    ).rejects.toThrow('source account not found')
  })

  it('should throw if destination account does not exist', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        fromAccountId: from.id,
        toAccountId: randomUUID() as UUID,
        amount: 500,
        date: new Date(),
        description: 'Transferência',
      }),
    ).rejects.toThrow('destination account not found')
  })

  it('should throw if source account belongs to another user', async () => {
    const from = await makeAccount(OTHER_USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        fromAccountId: from.id,
        toAccountId: to.id,
        amount: 500,
        date: new Date(),
        description: 'Transferência',
      }),
    ).rejects.toThrow('unauthorized')
  })

  it('should throw if destination account belongs to another user', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(OTHER_USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        fromAccountId: from.id,
        toAccountId: to.id,
        amount: 500,
        date: new Date(),
        description: 'Transferência',
      }),
    ).rejects.toThrow('unauthorized')
  })

  it('should throw if source and destination are the same account', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        fromAccountId: account.id,
        toAccountId: account.id,
        amount: 500,
        date: new Date(),
        description: 'Transferência',
      }),
    ).rejects.toThrow('source and destination accounts must be different')
  })

  it('should throw if amount is zero', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        fromAccountId: from.id,
        toAccountId: to.id,
        amount: 0,
        date: new Date(),
        description: 'Transferência',
      }),
    ).rejects.toThrow('amount must be greater than zero')
  })

  it('should throw if amount is negative', async () => {
    const from = await makeAccount(USER_ID, accountsRepository)
    const to = await makeAccount(USER_ID, accountsRepository)

    await expect(
      sut({
        userId: USER_ID,
        fromAccountId: from.id,
        toAccountId: to.id,
        amount: -100,
        date: new Date(),
        description: 'Transferência',
      }),
    ).rejects.toThrow('amount must be greater than zero')
  })
})

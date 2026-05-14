import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAccount } from '~/tests/helpers'
import { InMemoryAccountsRepository } from '~/tests/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeListAccountsUseCase } from './list-accounts'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let accountsRepository: InMemoryAccountsRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: ReturnType<typeof makeListAccountsUseCase>

describe('List Accounts Use Case', () => {
  beforeEach(() => {
    accountsRepository = new InMemoryAccountsRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = makeListAccountsUseCase(accountsRepository, transactionsRepository)
  })

  it('should return an empty array when the user has no accounts', async () => {
    const { accounts } = await sut({ userId: USER_ID })
    expect(accounts).toHaveLength(0)
  })

  it('should return accounts belonging to the user with their balance', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    transactionsRepository.items.push(
      { accountId: account.id, type: 'income', amount: 5000 },
      { accountId: account.id, type: 'expense', amount: 1500 },
    )

    const { accounts } = await sut({ userId: USER_ID })

    expect(accounts).toHaveLength(1)
    expect(accounts[0].balance).toBe(3500)
  })

  it('should not return archived accounts', async () => {
    await makeAccount(USER_ID, accountsRepository, { isArchived: true })
    await makeAccount(USER_ID, accountsRepository, {
      name: 'Poupança',
      isArchived: false,
    })

    const { accounts } = await sut({ userId: USER_ID })

    expect(accounts).toHaveLength(1)
    expect(accounts[0].name).toBe('Poupança')
  })

  it('should not return accounts from other users', async () => {
    await makeAccount(USER_ID, accountsRepository)
    await makeAccount(OTHER_USER_ID, accountsRepository)

    const { accounts } = await sut({ userId: USER_ID })

    expect(accounts).toHaveLength(1)
    expect(accounts[0].userId).toBe(USER_ID)
  })

  it('should return zero balance for an account with no transactions', async () => {
    await makeAccount(USER_ID, accountsRepository)

    const { accounts } = await sut({ userId: USER_ID })

    expect(accounts[0].balance).toBe(0)
  })

  it('should calculate balance as income minus expense and transfers', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    transactionsRepository.items.push(
      { accountId: account.id, type: 'income', amount: 10000 },
      { accountId: account.id, type: 'expense', amount: 2000 },
      { accountId: account.id, type: 'transfer_out', amount: 1000 },
    )

    const { accounts } = await sut({ userId: USER_ID })

    expect(accounts[0].balance).toBe(7000)
  })
})

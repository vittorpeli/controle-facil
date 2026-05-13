import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAccount } from '~/tests/helpers'
import { InMemoryAccountsRepository } from '~/tests/repositories/in-memory-accounts-repository'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeArchiveAccountUseCase } from './archive-account'
import { makeListAccountsUseCase } from './list-accounts'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let accountsRepository: InMemoryAccountsRepository
let transactionsRepository: InMemoryTransactionsRepository
let sut: ReturnType<typeof makeArchiveAccountUseCase>

describe('Archive Account Use Case', () => {
  beforeEach(() => {
    accountsRepository = new InMemoryAccountsRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = makeArchiveAccountUseCase(accountsRepository)
  })

  it('should set isArchived to true on the account', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    await sut({ accountId: account.id, userId: USER_ID })

    const updated = await accountsRepository.findById(account.id)
    expect(updated?.isArchived).toBe(true)
  })

  it('should not delete the account record', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    await sut({ accountId: account.id, userId: USER_ID })

    expect(accountsRepository.items).toHaveLength(1)
  })

  it('should preserve existing transactions after archiving', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)
    transactionsRepository.items.push({
      accountId: account.id,
      type: 'income',
      amount: 5000,
    })

    await sut({ accountId: account.id, userId: USER_ID })

    expect(transactionsRepository.items).toHaveLength(1)
  })

  it('archived account should not appear in list-accounts', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    await sut({ accountId: account.id, userId: USER_ID })

    const listAccounts = makeListAccountsUseCase(
      accountsRepository,
      transactionsRepository,
    )
    const { accounts } = await listAccounts({ userId: USER_ID })

    expect(accounts).toHaveLength(0)
  })

  it('should throw if account does not exist', async () => {
    await expect(
      sut({ accountId: randomUUID() as UUID, userId: USER_ID }),
    ).rejects.toThrow('Account not found')
  })

  it('should throw if account belongs to another user', async () => {
    const account = await makeAccount(OTHER_USER_ID, accountsRepository)

    await expect(
      sut({ accountId: account.id, userId: USER_ID }),
    ).rejects.toThrow('Unauthorized')
  })

  it('should be idempotent — archiving an already archived account does not throw', async () => {
    const account = await makeAccount(USER_ID, accountsRepository, {
      isArchived: true,
    })

    await expect(
      sut({ accountId: account.id, userId: USER_ID }),
    ).resolves.not.toThrow()
  })
})

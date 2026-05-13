import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeAccount } from '~/tests/helpers'
import { InMemoryAccountsRepository } from '~/tests/repositories/in-memory-accounts-repository'
import { makeEditAccountUseCase } from './edit-account'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let accountsRepository: InMemoryAccountsRepository
let sut: ReturnType<typeof makeEditAccountUseCase>

describe('Edit Account Use Case', () => {
  beforeEach(() => {
    accountsRepository = new InMemoryAccountsRepository()
    sut = makeEditAccountUseCase(accountsRepository)
  })

  it('should update the account name', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    const { account: updated } = await sut({
      accountId: account.id,
      userId: USER_ID,
      name: 'Novo Nome',
    })

    expect(updated.name).toBe('Novo Nome')
  })

  it('should update the account type', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    const { account: updated } = await sut({
      accountId: account.id,
      userId: USER_ID,
      type: 'savings',
    })

    expect(updated.type).toBe('savings')
  })

  it('should update the institution', async () => {
    const account = await makeAccount(USER_ID, accountsRepository)

    const { account: updated } = await sut({
      accountId: account.id,
      userId: USER_ID,
      institution: 'Bradesco',
    })

    expect(updated.institution).toBe('Bradesco')
  })

  it('should allow partial updates — untouched fields remain unchanged', async () => {
    const account = await makeAccount(USER_ID, accountsRepository, {
      name: 'Original',
      type: 'checking',
      institution: 'Itaú',
    })

    const { account: updated } = await sut({
      accountId: account.id,
      userId: USER_ID,
      institution: 'Nubank',
    })

    expect(updated.name).toBe('Original')
    expect(updated.type).toBe('checking')
    expect(updated.institution).toBe('Nubank')
  })

  it('should not change the isArchived status', async () => {
    const account = await makeAccount(USER_ID, accountsRepository, {
      isArchived: false,
    })

    const { account: updated } = await sut({
      accountId: account.id,
      userId: USER_ID,
      name: 'Renomeada',
    })

    expect(updated.isArchived).toBe(false)
  })

  it('should throw if account does not exist', async () => {
    await expect(
      sut({
        accountId: randomUUID() as UUID,
        userId: USER_ID,
        name: 'Qualquer',
      }),
    ).rejects.toThrow('account not found')
  })

  it('should throw if account belongs to another user', async () => {
    const account = await makeAccount(OTHER_USER_ID, accountsRepository)

    await expect(
      sut({
        accountId: account.id,
        userId: USER_ID,
        name: 'Tentativa',
      }),
    ).rejects.toThrow('unauthorized')
  })
})

import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAccountsRepository } from '~/tests/repositories/in-memory-accounts-repository'
import { makeCreateAccountUseCase } from './create-account'

const USER_ID = randomUUID() as UUID

let accountsRepository: InMemoryAccountsRepository
let sut: ReturnType<typeof makeCreateAccountUseCase>

describe('Create Account Use Case', () => {
  beforeEach(() => {
    accountsRepository = new InMemoryAccountsRepository()
    sut = makeCreateAccountUseCase(accountsRepository)
  })

  it('should be able to create a new account', async () => {
    const { account } = await sut({
      userId: USER_ID,
      name: 'Conta Corrente',
      type: 'checking',
      institution: 'Nubank',
    })

    expect(account.id).toBeDefined()
    expect(account.name).toBe('Conta Corrente')
    expect(account.type).toBe('checking')
    expect(account.institution).toBe('Nubank')
    expect(account.userId).toBe(USER_ID)
  })

  it('should persist the account in the repository', async () => {
    await sut({
      userId: USER_ID,
      name: 'Poupança',
      type: 'savings',
      institution: null,
    })

    expect(accountsRepository.items).toHaveLength(1)
  })

  it('should create account with isArchived set to false by default', async () => {
    const { account } = await sut({
      userId: USER_ID,
      name: 'Carteira',
      type: 'cash',
      institution: null,
    })

    expect(account.isArchived).toBe(false)
  })

  it('should generate a unique id for each account', async () => {
    const { account: a1 } = await sut({
      userId: USER_ID,
      name: 'Conta 1',
      type: 'checking',
      institution: null,
    })
    const { account: a2 } = await sut({
      userId: USER_ID,
      name: 'Conta 2',
      type: 'savings',
      institution: null,
    })

    expect(a1.id).not.toBe(a2.id)
  })

  it('should allow creating accounts without institution', async () => {
    const { account } = await sut({
      userId: USER_ID,
      name: 'Carteira',
      type: 'cash',
      institution: null,
    })

    expect(account.institution).toBeNull()
  })
})

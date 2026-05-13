import type { UUID } from 'node:crypto'
import type { AccountsRepository } from '~/features/transactions/application/ports/accounts-repository'
import type { Account } from '~/features/transactions/core/account'

export class InMemoryAccountsRepository implements AccountsRepository {
  public items: Account[] = []

  async create(account: Account): Promise<Account> {
    this.items.push(account)
    return account
  }

  async findAllByUserId(userId: UUID): Promise<Account[]> {
    return this.items.filter((account) => account.userId === userId)
  }

  async findById(id: UUID): Promise<Account | null> {
    const account = this.items.find((account) => account.id === id)
    return account ?? null
  }

  async update(account: Account): Promise<Account> {
    const index = this.items.findIndex((a) => a.id === account.id)
    if (index === -1) throw new Error('Account not found')
    this.items[index] = account
    return account
  }
}

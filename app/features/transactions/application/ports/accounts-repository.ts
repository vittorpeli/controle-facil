import type { UUID } from 'node:crypto'
import type { Account } from '../../core/account'

export interface AccountsRepository {
  create(account: Account): Promise<Account>
  findById(id: UUID): Promise<Account | null>
  findAllByUserId(userId: UUID): Promise<Account[]>
  update(account: Account): Promise<Account>
}

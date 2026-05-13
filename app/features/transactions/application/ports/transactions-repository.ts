import type { UUID } from 'node:crypto'

export interface TransactionsRepository {
  getBalanceByAccountId(accountId: UUID): Promise<number>
}

import type { UUID } from 'node:crypto'
import type { Transaction } from '../../core/transaction'

export interface TransactionsRepository {
  getBalanceByAccountId(accountId: UUID): Promise<number>
  create(transaction: Transaction): Promise<Transaction>
  createTransfer(params: {
    outbound: Transaction
    inbound: Transaction
  }): Promise<{ outbound: Transaction; inbound: Transaction }>
}

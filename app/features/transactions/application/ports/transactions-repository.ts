import type { UUID } from 'node:crypto'
import type { Transaction, TransactionType } from '../../core/transaction'

export interface TransactionFilters {
  accountId?: UUID
  categoryId?: UUID
  type?: TransactionType | TransactionType[]
  month?: number
  year?: number
}

export interface TransactionsRepository {
  getBalanceByAccountId(accountId: UUID): Promise<number>
  create(transaction: Transaction): Promise<Transaction>
  createTransfer(params: {
    outbound: Transaction
    inbound: Transaction
  }): Promise<{ outbound: Transaction; inbound: Transaction }>
  findAllByUserId(
    userId: UUID,
    filters?: TransactionFilters,
  ): Promise<Transaction[]>
  findById(id: UUID): Promise<Transaction | null>
  update(transaction: Transaction): Promise<Transaction>
}

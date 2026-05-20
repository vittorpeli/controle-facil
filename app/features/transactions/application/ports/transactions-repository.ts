import type { UUID } from 'node:crypto'
import type { Transaction, TransactionType } from '../../core/transaction'
import type { TransactionListItem } from '../dtos/transaction-list-item'

export interface TransactionFilters {
  accountId?: UUID
  categoryId?: UUID
  type?: TransactionType | TransactionType[]
  month?: number
  year?: number
}

export interface TransactionsRepository {
  getBalanceByAccountId(accountId: UUID): Promise<number>
  getBalancesByUserId(userId: UUID): Promise<Map<UUID, number>>
  create(transaction: Transaction): Promise<Transaction>
  createTransfer(params: {
    outbound: Transaction
    inbound: Transaction
  }): Promise<{ outbound: Transaction; inbound: Transaction }>
  findAllByUserId(
    userId: UUID,
    filters?: TransactionFilters,
  ): Promise<TransactionListItem[]>
  findAllByUserIdAndDate(
    userId: UUID,
    month: number,
    year: number,
  ): Promise<Transaction[]>
  findById(id: UUID): Promise<Transaction | null>
  update(transaction: Transaction): Promise<Transaction>
  delete(id: UUID): Promise<void>
}

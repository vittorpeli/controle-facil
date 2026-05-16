import type { UUID } from 'node:crypto'
import type { Transaction, TransactionType } from '../../core/transaction'
import { computeTotals } from '../../services/compute-totals'
import type { TransactionsRepository } from '../ports/transactions-repository'

interface ListTransactionsRequest {
  userId: UUID
  accountId?: UUID
  categoryId?: UUID
  type?: TransactionType | TransactionType[]
  month?: number
  year?: number
}

export interface PeriodTotals {
  income: number
  expense: number
  balance: number
}

interface ListTransactionsResponse {
  transactions: Transaction[]
  totals: PeriodTotals
}

export const makeListTransactionsUseCase = (
  transactionsRepository: TransactionsRepository,
) => {
  return async ({
    userId,
    accountId,
    categoryId,
    type,
    month,
    year,
  }: ListTransactionsRequest): Promise<ListTransactionsResponse> => {
    const transactions = await transactionsRepository.findAllByUserId(userId, {
      accountId,
      categoryId,
      type,
      month,
      year,
    })

    const totals = computeTotals(transactions)

    return { transactions, totals }
  }
}

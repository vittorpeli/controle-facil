import type { PeriodTotals } from '../application/use-cases/list-transactions'
import type { Transaction, TransactionType } from '../core/transaction'

const INCOME_TYPES = new Set<TransactionType>(['income', 'transfer_in'])
const EXPENSE_TYPES = new Set<TransactionType>([
  'expense',
  'transfer_out',
  'contribution',
])

export function computeTotals(transactions: Transaction[]): PeriodTotals {
  let income = 0
  let expense = 0

  for (const t of transactions) {
    if (INCOME_TYPES.has(t.type)) income += t.amount
    if (EXPENSE_TYPES.has(t.type)) expense += t.amount
  }

  return { income, expense, balance: income - expense }
}

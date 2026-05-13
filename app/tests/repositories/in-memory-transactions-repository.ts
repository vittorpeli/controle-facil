import type { UUID } from 'node:crypto'
import type { TransactionsRepository } from '~/features/transactions/application/ports/transactions-repository'

type FakeTransaction = {
  accountId: UUID
  type: 'income' | 'expense' | 'transfer'
  amount: number
}

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: FakeTransaction[] = []

  async getBalanceByAccountId(accountId: UUID): Promise<number> {
    const accountTransactions = this.items.filter(
      (t) => t.accountId === accountId,
    )

    const income = accountTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const outflow = accountTransactions
      .filter((t) => t.type === 'expense' || t.type === 'transfer')
      .reduce((sum, t) => sum + t.amount, 0)

    return income - outflow
  }
}

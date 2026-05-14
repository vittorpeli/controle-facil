import type { UUID } from 'node:crypto'
import type { TransactionsRepository } from '~/features/transactions/application/ports/transactions-repository'
import type { Transaction } from '~/features/transactions/core/transaction'

type FakeTransaction = {
  accountId: UUID
  type: 'income' | 'expense' | 'transfer_in' | 'transfer_out'
  amount: number
}

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: FakeTransaction[] = []
  public transactions: Transaction[] = []

  async getBalanceByAccountId(accountId: UUID): Promise<number> {
    const accountTransactions = this.items.filter(
      (t) => t.accountId === accountId,
    )

    const income = accountTransactions
      .filter((t) => t.type === 'income' || t.type === 'transfer_in')
      .reduce((sum, t) => sum + t.amount, 0)

    const outflow = accountTransactions
      .filter((t) => t.type === 'expense' || t.type === 'transfer_out')
      .reduce((sum, t) => sum + t.amount, 0)

    return income - outflow
  }

  async createTransfer({
    outbound,
    inbound,
  }: {
    outbound: Transaction
    inbound: Transaction
  }): Promise<{ outbound: Transaction; inbound: Transaction }> {
    this.transactions.push(outbound, inbound)

    this.items.push(
      {
        accountId: outbound.accountId,
        type: 'transfer_out',
        amount: outbound.amount,
      },
      {
        accountId: inbound.accountId,
        type: 'transfer_in',
        amount: inbound.amount,
      },
    )

    return { outbound, inbound }
  }
}

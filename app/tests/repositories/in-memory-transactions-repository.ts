import type { UUID } from 'node:crypto'
import type { TransactionListItem } from '~/features/transactions/application/dtos/transaction-list-item'
import type {
  TransactionFilters,
  TransactionsRepository,
} from '~/features/transactions/application/ports/transactions-repository'
import type { Transaction } from '~/features/transactions/core/transaction'
import type { InMemoryCategoriesRepository } from './in-memory-categories-repository'

type FakeTransaction = {
  accountId: UUID
  type: 'income' | 'expense' | 'transfer_in' | 'transfer_out' | 'contribution'
  amount: number
}

export class InMemoryTransactionsRepository implements TransactionsRepository {
  constructor(private categoriesRepository: InMemoryCategoriesRepository) {}

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
      .filter(
        (t) =>
          t.type === 'expense' ||
          t.type === 'transfer_out' ||
          t.type === 'contribution',
      )
      .reduce((sum, t) => sum + t.amount, 0)

    return income - outflow
  }

  async getBalancesByUserId(userId: UUID): Promise<Map<UUID, number>> {
    const balances = new Map<UUID, number>()

    for (const transaction of this.transactions) {
      if (transaction.userId !== userId) continue

      const currentBalance = balances.get(transaction.accountId) ?? 0

      const isIncome =
        transaction.type === 'income' || transaction.type === 'transfer_in'
      const isOutflow =
        transaction.type === 'expense' ||
        transaction.type === 'transfer_out' ||
        transaction.type === 'contribution'

      let nextBalance = currentBalance

      if (isIncome) {
        nextBalance += transaction.amount
      }

      if (isOutflow) {
        nextBalance -= transaction.amount
      }

      balances.set(transaction.accountId, nextBalance)
    }

    return balances
  }

  async create(transaction: Transaction): Promise<Transaction> {
    this.transactions.push(transaction)
    this.items.push({
      accountId: transaction.accountId,
      type: transaction.type as FakeTransaction['type'],
      amount: transaction.amount,
    })
    return transaction
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

  async findAllByUserId(
    userId: UUID,
    filters?: TransactionFilters,
  ): Promise<TransactionListItem[]> {
    let result = this.transactions.filter((t) => t.userId === userId)

    if (filters?.accountId) {
      result = result.filter((t) => t.accountId === filters.accountId)
    }

    if (filters?.categoryId) {
      result = result.filter((t) => t.categoryId === filters.categoryId)
    }

    if (filters?.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type]
      result = result.filter((t) => types.includes(t.type))
    }

    if (filters?.month !== undefined && filters.year !== undefined) {
      result = result.filter((t) => {
        return (
          t.date.getMonth() + 1 === filters.month &&
          t.date.getFullYear() === filters.year
        )
      })
    } else if (filters?.year !== undefined) {
      result = result.filter((t) => t.date.getFullYear() === filters.year)
    }

    const categoriesMap = new Map(
      this.categoriesRepository.items.map((c) => [c.id, c]),
    )

    return result
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map((tx) => {
        const category = tx.categoryId
          ? categoriesMap.get(tx.categoryId)
          : undefined

        return {
          ...tx,

          category: {
            id:
              tx.categoryId ?? ('00000000-0000-0000-0000-000000000000' as UUID),
            name: category?.name ?? 'Sem categoria',
          },
        }
      })
  }

  async findAllByUserIdAndDate(
    userId: UUID,
    month: number,
    year: number,
  ): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) =>
        t.userId === userId &&
        t.date.getMonth() === month - 1 &&
        t.date.getFullYear() === year,
    )
  }

  async findById(id: UUID): Promise<Transaction | null> {
    return this.transactions.find((t) => t.id === id) ?? null
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const index = this.transactions.findIndex((t) => t.id === transaction.id)
    if (index === -1) throw new Error('transaction not found')
    this.transactions[index] = transaction
    return transaction
  }

  async delete(id: UUID): Promise<void> {
    const index = this.transactions.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('transaction not found')
    this.transactions.splice(index, 1)
  }
}

import type { UUID } from 'node:crypto'
import { and, eq, ne, sql } from 'drizzle-orm'
import { db } from '~/lib/db'
import { transactions } from '~/lib/db/schema'
import type { TransactionsRepository } from '../application/ports/transactions-repository'
import type { Transaction } from '../core/transaction'

export class DrizzleTransactionsRepository implements TransactionsRepository {
  async getBalanceByAccountId(accountId: UUID): Promise<number> {
    const result = await db
      .select({
        balance: sql<number>`
            COALESCE(SUM(CASE WHEN type IN ('income', 'transfer_in') THEN ${transactions.amount} ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ${transactions.type} IN ('expense', 'transfer_out', 'contribution') THEN ${transactions.amount} ELSE 0 END), 0)
        `.as('balance'),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.accountId, accountId),
          ne(transactions.status, 'cancelled'),
        ),
      )
      .get()

    return result?.balance ?? 0
  }

  async create(transaction: Transaction): Promise<Transaction> {
    await db.insert(transactions).values({
      id: transaction.id,
      userId: transaction.userId,
      accountId: transaction.accountId,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date.toISOString().slice(0, 10),
      categoryId: transaction.categoryId ?? null,
      description: transaction.description ?? null,
      goalId: transaction.goalId ?? null,
      transferGroupId: transaction.transferGroupId ?? null,
      status: transaction.status,
      createdAt: transaction.createdAt.toISOString(),
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
    await db.transaction(async (tx) => {
      await tx.insert(transactions).values({
        ...outbound,
        date: outbound.date.toISOString(),
        createdAt: outbound.createdAt.toISOString(),
      })
      await tx.insert(transactions).values({
        ...inbound,
        date: inbound.date.toISOString(),
        createdAt: inbound.createdAt.toISOString(),
      })
    })

    return { outbound, inbound }
  }
}

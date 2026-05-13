import type { UUID } from 'node:crypto'
import { and, eq, ne, sql } from 'drizzle-orm'
import { db } from '~/lib/db'
import { transactions } from '~/lib/db/schema'
import type { TransactionsRepository } from '../application/ports/transactions-repository'

export class DrizzleTransactionsRepository implements TransactionsRepository {
  async getBalanceByAccountId(accountId: UUID): Promise<number> {
    const result = await db
      .select({
        balance: sql<number>`
            COALESCE(SUM(CASE WHEN type = 'income' THEN ${transactions.amount} ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ${transactions.type} IN ('expense', 'transfer') THEN ${transactions.amount} ELSE 0 END), 0)
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
}

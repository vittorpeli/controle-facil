import type { UUID } from 'node:crypto'
import { and, desc, eq, gte, inArray, lt, ne, sql } from 'drizzle-orm'
import { db } from '~/lib/db'
import { transactions } from '~/lib/db/schema'
import type {
  TransactionFilters,
  TransactionsRepository,
} from '../application/ports/transactions-repository'
import type { Transaction } from '../core/transaction'

function toDomain(row: typeof transactions.$inferSelect): Transaction {
  return {
    id: row.id as UUID,
    userId: row.userId as UUID,
    accountId: row.accountId as UUID,
    transferGroupId: (row.transferGroupId as UUID) ?? null,
    type: row.type,
    amount: row.amount,
    date: new Date(row.date),
    categoryId: (row.categoryId as UUID) ?? null,
    description: row.description ?? null,
    goalId: (row.goalId as UUID) ?? null,
    status: row.status,
    createdAt: new Date(row.createdAt), // text ISO → Date
  }
}

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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

  async findById(id: UUID): Promise<Transaction | null> {
    const transaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .get()
    return transaction ? toDomain(transaction) : null
  }

  async findAllByUserId(
    userId: UUID,
    filters?: TransactionFilters,
  ): Promise<Transaction[]> {
    const conditions = [eq(transactions.userId, userId)]

    if (filters?.accountId) {
      conditions.push(eq(transactions.accountId, filters.accountId))
    }

    if (filters?.categoryId) {
      conditions.push(eq(transactions.categoryId, filters.categoryId))
    }

    if (filters?.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type]
      conditions.push(inArray(transactions.type, types))
    }

    if (filters?.month !== undefined && filters.year !== undefined) {
      conditions.push(
        sql`strftime('%m', ${transactions.date}) = ${String(filters.month).padStart(2, '0')}`,
      )
      conditions.push(
        sql`strftime('%Y', ${transactions.date}) = ${String(filters.year)}`,
      )
    } else if (filters?.year !== undefined) {
      conditions.push(
        sql`strftime('%Y', ${transactions.date}) = ${String(filters.year)}`,
      )
    }

    const rows = await db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.date))
      .all()

    return rows.map(toDomain)
  }

  async findAllByUserIdAndDate(
    userId: UUID,
    month: number,
    year: number,
  ): Promise<Transaction[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = `${year + (month === 12 ? 1 : 0)}-${String(
      month === 12 ? 1 : month + 1,
    ).padStart(2, '0')}-01`

    const rows = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.date, startDate),
          lt(transactions.date, endDate),
        ),
      )
      .all()
    return rows.map(toDomain)
  }

  async update(transaction: Transaction): Promise<Transaction> {
    await db.update(transactions).set({
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      amount: transaction.amount,
      date: toDateString(transaction.date),
      description: transaction.description,
    })

    return transaction
  }

  async delete(id: UUID): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id))
  }
}

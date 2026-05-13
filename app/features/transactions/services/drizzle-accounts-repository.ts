import type { UUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { accounts } from '~/lib/db/schema'
import type { AccountsRepository } from '../application/ports/accounts-repository'
import type { Account } from '../core/account'

function toDomain(row: typeof accounts.$inferSelect): Account {
  return {
    id: row.id as UUID,
    userId: row.userId as UUID,
    name: row.name,
    type: row.type,
    institution: row.institution,
    isArchived: row.isArchived,
    createdAt: new Date(row.createdAt), // text ISO → Date
  }
}

export class DrizzleAccountsRepository implements AccountsRepository {
  async create(account: Account): Promise<Account> {
    await db.insert(accounts).values({
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type,
      institution: account.institution,
      isArchived: account.isArchived,
      createdAt: account.createdAt.toISOString(),
    })

    return account
  }
  async findById(id: UUID): Promise<Account | null> {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, id))
      .get()
    return account ? toDomain(account) : null
  }
  async findAllByUserId(userId: UUID): Promise<Account[]> {
    const rows = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.userId, userId), eq(accounts.isArchived, false)))
      .all()
    return rows.map(toDomain)
  }
  async update(account: Account): Promise<Account> {
    await db
      .update(accounts)
      .set({
        name: account.name,
        type: account.type,
        institution: account.institution,
        isArchived: account.isArchived,
      })
      .where(eq(accounts.id, account.id))

    return account
  }
}

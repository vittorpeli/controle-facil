import type { UUID } from 'crypto'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { recurrences } from '~/lib/db/schema'
import type { RecurrencesRepository } from '../application/ports/recurrences-repository'
import type { Recurrence } from '../core/recurrence'

function toDomain(row: typeof recurrences.$inferSelect): Recurrence {
  return {
    id: row.id as UUID,
    userId: row.userId as UUID,
    name: row.name,
    amount: row.amount,
    frequency: row.frequency,
    dueDay: row.dueDay,
    accountId: row.accountId as UUID,
    categoryId: row.categoryId as UUID,
    isSubscription: row.isSubscription,
    createdAt: new Date(row.createdAt),
  }
}

export class DrizzleRecurrencesRepository implements RecurrencesRepository {
  async create(recurrence: Recurrence): Promise<Recurrence> {
    await db.insert(recurrences).values({
      id: recurrence.id,
      userId: recurrence.userId,
      name: recurrence.name,
      amount: recurrence.amount,
      frequency: recurrence.frequency,
      dueDay: recurrence.dueDay ?? null,
      accountId: recurrence.accountId,
      categoryId: recurrence.categoryId,
      isSubscription: recurrence.isSubscription,
      createdAt: recurrence.createdAt.toISOString(),
    })

    return recurrence
  }

  async findById(id: UUID): Promise<Recurrence | null> {
    const recurrence = await db
      .select()
      .from(recurrences)
      .where(eq(recurrences.id, id))
      .get()
    return recurrence ? toDomain(recurrence) : null
  }

  async findAllByUserId(userId: UUID): Promise<Recurrence[]> {
    const rows = await db
      .select()
      .from(recurrences)
      .where(eq(recurrences.userId, userId))
      .all()
    return rows.map(toDomain)
  }
}

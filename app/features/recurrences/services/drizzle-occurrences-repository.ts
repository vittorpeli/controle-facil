import type { UUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { recurrenceOccurrences } from '~/lib/db/schema'
import type { OccurrencesRepository } from '../application/ports/occurrences-repository'
import type { Occurrence } from '../core/occurrence'

function toDomain(rows: typeof recurrenceOccurrences.$inferSelect): Occurrence {
  return {
    id: rows.id as UUID,
    recurrenceId: rows.recurrenceId as UUID,
    referenceMonth: rows.referenceMonth,
    referenceYear: rows.referenceYear,
    dueDate: new Date(rows.dueDate),
    status: rows.status,
    transactionId: rows.transactionId as UUID,
    createdAt: new Date(rows.createdAt),
  }
}

export class DrizzleOccurrencesRepository implements OccurrencesRepository {
  async create(occurrence: Occurrence): Promise<Occurrence> {
    await db.insert(recurrenceOccurrences).values({
      id: occurrence.id,
      recurrenceId: occurrence.recurrenceId,
      referenceMonth: occurrence.referenceMonth,
      referenceYear: occurrence.referenceYear,
      dueDate: occurrence.dueDate.toISOString(),
      status: occurrence.status,
      transactionId: occurrence.transactionId,
      createdAt: occurrence.createdAt.toISOString(),
    })

    return occurrence
  }

  async findById(id: UUID): Promise<Occurrence | null> {
    const occurrence = await db
      .select()
      .from(recurrenceOccurrences)
      .where(eq(recurrenceOccurrences.id, id))
      .get()
    return occurrence ? toDomain(occurrence) : null
  }

  async findByRecurrenceIdAndDate(
    recurrenceId: UUID,
    month: number,
    year: number,
  ): Promise<Occurrence | null> {
    const occurrence = await db
      .select()
      .from(recurrenceOccurrences)
      .where(
        and(
          eq(recurrenceOccurrences.recurrenceId, recurrenceId),
          eq(recurrenceOccurrences.referenceMonth, month),
          eq(recurrenceOccurrences.referenceYear, year),
        ),
      )
      .get()
    return occurrence ? toDomain(occurrence) : null
  }

  async update(occurrence: Occurrence): Promise<Occurrence> {
    await db
      .update(recurrenceOccurrences)
      .set({
        status: occurrence.status,
        transactionId: occurrence.transactionId,
      })
      .where(eq(recurrenceOccurrences.id, occurrence.id))
    return occurrence
  }
}

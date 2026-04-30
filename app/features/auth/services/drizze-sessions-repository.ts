import type { UUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { sessions } from '~/lib/db/schema'
import type { SessionsRepository } from '../application/ports/sessions-repository'
import type { Session } from '../core/session'

function toDomain(row: typeof sessions.$inferSelect): Session {
  return {
    id: row.id as UUID,
    userId: row.userId as UUID,
    token: row.token,
    expiresAt: new Date(row.expiresAt),
    createdAt: new Date(row.createdAt),
  }
}

export class DrizzleSessionsRepository implements SessionsRepository {
  async create(session: Session): Promise<Session> {
    await db.insert(sessions).values({
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt.toISOString(),
      createdAt: session.createdAt.toISOString(),
    })

    return session
  }
  async findByToken(token: string): Promise<Session | null> {
    const row = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .get()
    return row ? toDomain(row) : null
  }
  async deleteByToken(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token))
  }
}

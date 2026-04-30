import type { UUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { users } from '~/lib/db/schema'
import type { UsersRepository } from '../application/ports/users-repository'
import type { Email } from '../core/email'
import type { User } from '../core/user'

function toDomain(row: typeof users.$inferSelect): User {
  return {
    id: row.id as UUID,
    name: row.name,
    email: row.email as Email,
    passwordHash: row.passwordHash,
    createdAt: new Date(row.createdAt), // text ISO → Date
  }
}

export class DrizzleUsersRepository implements UsersRepository {
  async create(user: User): Promise<User> {
    await db.insert(users).values({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt.toISOString(),
    })

    return user
  }

  async findById(id: UUID): Promise<User | null> {
    const row = await db.select().from(users).where(eq(users.id, id)).get()
    return row ? toDomain(row) : null
  }

  async findByEmail(email: Email): Promise<User | null> {
    const row = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get()
    return row ? toDomain(row) : null
  }
}

import type { UUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { goals } from '~/lib/db/schema'
import type { GoalsRepository } from '../application/ports/goals-repository'
import type { Goal } from '../core/goal'

// Banco -> Domínio
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toDomain(row: typeof goals.$inferSelect): Goal {
  return {
    id: row.id as UUID,
    userId: row.userId as UUID,
    name: row.name,
    targetAmount: row.targetAmount,
    deadline: row.deadline ? parseLocalDate(row.deadline) : new Date(),
    description: row.description,
    createdAt: new Date(row.createdAt),
  }
}

// Domínio -> Banco
function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export class DrizzleGoalsRepository implements GoalsRepository {
  async create(goal: Goal): Promise<Goal> {
    await db.insert(goals).values({
      id: goal.id,
      userId: goal.userId,
      name: goal.name,
      targetAmount: goal.targetAmount,
      deadline: goal.deadline ? toDateString(goal.deadline) : null,
      description: goal.description,
      createdAt: goal.createdAt.toISOString(),
    })

    return goal
  }

  async findById(id: UUID): Promise<Goal | null> {
    const row = await db.select().from(goals).where(eq(goals.id, id)).get()
    return row ? toDomain(row) : null
  }

  async findAllByUserId(userId: UUID): Promise<Goal[]> {
    const rows = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .all()
    return rows.map(toDomain)
  }

  async update(goal: Goal): Promise<Goal> {
    await db.update(goals).set({
      name: goal.name,
      targetAmount: goal.targetAmount,
      deadline: toDateString(goal.deadline),
      description: goal.description,
    })

    return goal
  }

  async delete(id: UUID): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id))
  }
}

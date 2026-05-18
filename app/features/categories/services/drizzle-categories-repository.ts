import type { UUID } from 'node:crypto'
import { and, eq, isNull, or } from 'drizzle-orm'
import { db } from '~/lib/db'
import { categories } from '~/lib/db/schema'
import type { CategoriesRepository } from '../application/ports/categories-repository'
import type { Category } from '../core/category'

function toDomain(row: typeof categories.$inferSelect): Category {
  return {
    id: row.id as UUID,
    userId: row.userId as UUID,
    name: row.name,
    parentId: row.parentId as UUID,
    isDefault: row.isDefault,
    isArchived: row.isArchived,
    createdAt: new Date(row.createdAt),
  }
}

export class DrizzleCategoriesRepository implements CategoriesRepository {
  async create(category: Category): Promise<Category> {
    await db.insert(categories).values({
      id: category.id,
      userId: category.userId,
      name: category.name,
      parentId: category.parentId,
      isDefault: category.isDefault,
      isArchived: category.isArchived,
      createdAt: category.createdAt.toISOString(),
    })

    return category
  }

  async findById(id: UUID): Promise<Category | null> {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .get()
    return category ? toDomain(category) : null
  }

  async findByNameAndUserId(
    name: string,
    userId: UUID,
  ): Promise<Category | null> {
    const category = await db
      .select()
      .from(categories)
      .where(and(eq(categories.name, name), eq(categories.userId, userId)))
      .get()
    return category ? toDomain(category) : null
  }

  async findAllAccessibleByUserId(
    userId: UUID,
    options?: { includeArchived?: boolean },
  ): Promise<Category[]> {
    const includeArchived = options?.includeArchived ?? false

    const conditions = [
      or(isNull(categories.userId), eq(categories.userId, userId)),
    ]

    if (!includeArchived) {
      conditions.push(eq(categories.isArchived, false))
    }

    const rows = await db
      .select()
      .from(categories)
      .where(and(...conditions))
      .all()

    return rows.map(toDomain)
  }

  async findChildrenByParentId(parentId: UUID): Promise<Category[]> {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.parentId, parentId))
      .all()
    return rows.map(toDomain)
  }

  async update(category: Category): Promise<Category> {
    await db.update(categories).set({
      name: category.name,
      isArchived: category.isArchived,
    })
    return category
  }
}

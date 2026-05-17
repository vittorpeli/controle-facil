import type { UUID } from 'node:crypto'
import type { CategoriesRepository } from '~/features/categories/application/ports/categories-repository'
import type { Category } from '~/features/categories/core/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async create(category: Category): Promise<Category> {
    this.items.push(category)
    return category
  }

  async findById(id: UUID): Promise<Category | null> {
    return this.items.find((c) => c.id === id) ?? null
  }

  async findByNameAndUserId(
    name: string,
    userId: UUID,
  ): Promise<Category | null> {
    const normalizedName = name.trim().toLowerCase()
    return (
      this.items.find((c) => {
        const accessible = c.userId === null || c.userId === userId
        const comparedName = c.name.trim().toLowerCase() === normalizedName
        return accessible && comparedName
      }) ?? null
    )
  }

  async findAllAccessibleByUserId(
    userId: UUID,
    options?: { includeArchived?: boolean },
  ): Promise<Category[]> {
    const includeArchived = options?.includeArchived ?? false

    return this.items.filter((c) => {
      const accessible = c.userId === null || c.userId === userId
      const archivedOk = includeArchived || !c.isArchived
      return accessible && archivedOk
    })
  }

  async findChildrenByParentId(parentId: UUID): Promise<Category[]> {
    return this.items.filter((c) => c.parentId === parentId)
  }

  async update(category: Category): Promise<Category> {
    const index = this.items.findIndex((c) => c.id === category.id)
    if (index === -1) throw new Error('Category not found')
    this.items[index] = category
    return category
  }
}

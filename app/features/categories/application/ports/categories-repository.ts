import type { UUID } from 'node:crypto'
import type { Category } from '../../core/category'

export interface CategoriesRepository {
  create(category: Category): Promise<Category>
  findById(id: UUID): Promise<Category | null>
  findAllAccessibleByUserId(
    userId: UUID,
    options?: { includeArchived?: boolean },
  ): Promise<Category[]>
  findChildrenByParentId(parentId: UUID): Promise<Category[]>
  update(category: Category): Promise<Category>
}

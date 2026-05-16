import { randomUUID, type UUID } from 'node:crypto'
import type { Category } from '../../core/category'
import type { CategoriesRepository } from '../ports/categories-repository'

interface CreateCategoryRequest {
  userId: UUID | null
  name: string
  parentId?: UUID
}

interface CreateCategoryResponse {
  category: Category
}

export const makeCreateCategoryUseCase = (
  categoriesRepository: CategoriesRepository,
) => {
  return async ({
    userId,
    name,
    parentId,
  }: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    if (!name.trim()) {
      throw new Error('name cannot be empty')
    }

    if (parentId !== undefined) {
      const parent = await categoriesRepository.findById(parentId)

      // Não encontrado OU pertence a outro usuário e não é padrão
      const accessible =
        parent && (parent.isDefault || parent.userId === userId)
      if (!accessible) {
        throw new Error('parent category not found')
      }

      if (parent.parentId !== null) {
        throw new Error('subcategories cannot have children')
      }

      if (parent.isArchived) {
        throw new Error('parent category is archived')
      }
    }

    const category = await categoriesRepository.create({
      id: randomUUID() as UUID,
      userId,
      name: name.trim(),
      parentId: parentId ?? null,
      isDefault: false,
      isArchived: false,
      createdAt: new Date(),
    })

    return { category }
  }
}

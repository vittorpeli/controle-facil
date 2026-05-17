import type { UUID } from 'node:crypto'
import type { Category } from '../../core/category'
import type { CategoriesRepository } from '../ports/categories-repository'

interface EditCategoryRequest {
  categoryId: UUID
  userId: UUID
  name: string
}

interface EditCategoryResponse {
  category: Category
}

export const makeEditCategoryUseCase = (
  categoriesRepository: CategoriesRepository,
) => {
  return async ({
    categoryId,
    userId,
    name,
  }: EditCategoryRequest): Promise<EditCategoryResponse> => {
    const category = await categoriesRepository.findById(categoryId)
    if (!category) throw new Error('category not found')

    if (category.userId !== userId) throw new Error('unauthorized')

    if (category.isDefault)
      throw new Error('default categories cannot be edited')

    const normalizedName = name.trim().toLowerCase()

    const existingCategory = await categoriesRepository.findByNameAndUserId(
      normalizedName,
      userId,
    )
    if (existingCategory && existingCategory.id !== category.id)
      throw new Error('category name already in use')

    const updatedCategory = await categoriesRepository.update({
      ...category,
      name,
    })

    return { category: updatedCategory }
  }
}

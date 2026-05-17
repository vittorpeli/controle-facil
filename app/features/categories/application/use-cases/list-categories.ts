import type { UUID } from 'node:crypto'
import type { Category } from '../../core/category'
import type { CategoriesRepository } from '../ports/categories-repository'

interface ListCategoriesRequest {
  userId: UUID
  includeArchived?: boolean
}

interface ListCategoriesResponse {
  categories: Category[]
}

export const makeListCategoriesUseCase = (
  categoriesRepository: CategoriesRepository,
) => {
  return async ({
    userId,
    includeArchived = true,
  }: ListCategoriesRequest): Promise<ListCategoriesResponse> => {
    const allCategories = await categoriesRepository.findAllAccessibleByUserId(
      userId,
      {
        includeArchived,
      },
    )

    return { categories: allCategories }
  }
}

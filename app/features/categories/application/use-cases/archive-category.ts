import type { UUID } from 'node:crypto'
import type { CategoriesRepository } from '../ports/categories-repository'

interface ArchiveCategoryRequest {
  categoryId: UUID
  userId: UUID
}

export const makeArchiveCategoryUseCase = (
  categoriesRepository: CategoriesRepository,
) => {
  return async ({
    categoryId,
    userId,
  }: ArchiveCategoryRequest): Promise<void> => {
    const category = await categoriesRepository.findById(categoryId)

    const isAccessible =
      category !== null &&
      (category.userId === null || category.userId === userId)

    if (!isAccessible) throw new Error('category not found')

    if (category.isArchived) return

    await categoriesRepository.update({ ...category, isArchived: true })

    const children =
      await categoriesRepository.findChildrenByParentId(categoryId)

    await Promise.all(
      children
        .filter((child) => !child.isArchived)
        .map((child) =>
          categoriesRepository.update({ ...child, isArchived: true }),
        ),
    )
  }
}

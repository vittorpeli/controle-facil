import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeEditCategoryUseCase } from '../../application/use-cases/edit-category'
import { DrizzleCategoriesRepository } from '../../services/drizzle-categories-repository'
import { editCategorySchema } from '../schema/edit-category-schema'

export async function editCategoryAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: editCategorySchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const categoriesRepository = new DrizzleCategoriesRepository()
  const editCategory = makeEditCategoryUseCase(categoriesRepository)

  await editCategory({
    categoryId: submission.value.categoryId as UUID,
    userId,
    name: submission.value.name,
  })

  return Response.json({ success: true })
}

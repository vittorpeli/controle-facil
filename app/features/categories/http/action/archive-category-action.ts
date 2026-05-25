import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeArchiveCategoryUseCase } from '../../application/use-cases/archive-category'
import { DrizzleCategoriesRepository } from '../../services/drizzle-categories-repository'
import { archiveCategorySchema } from '../schema/archive-category-schema'

export async function archiveCategoryAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: archiveCategorySchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const categoriesRepository = new DrizzleCategoriesRepository()
  const archiveCategory = makeArchiveCategoryUseCase(categoriesRepository)

  await archiveCategory({
    categoryId: submission.value.categoryId as UUID,
    userId,
  })

  return Response.json({ success: true })
}

import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeCreateCategoryUseCase } from '../../application/use-cases/create-category'
import { DrizzleCategoriesRepository } from '../../services/drizzle-categories-repository'
import { createCategorySchema } from '../schema/create-category-schema'

export async function createCategoryAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: createCategorySchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const categoriesRepository = new DrizzleCategoriesRepository()
  const createCategory = makeCreateCategoryUseCase(categoriesRepository)

  await createCategory({
    userId,
    name: submission.value.name,
    parentId: (submission.value.parentId as UUID) ?? null,
  })

  return Response.json({ success: true })
}

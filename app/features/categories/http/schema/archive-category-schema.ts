import z from 'zod'

export const archiveCategorySchema = z.object({
  categoryId: z.uuid(),
})

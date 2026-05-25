import z from 'zod'

export const editCategorySchema = z.object({
  categoryId: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'Nome obrigatório')
    .max(50, 'Nome muito longo'),
})

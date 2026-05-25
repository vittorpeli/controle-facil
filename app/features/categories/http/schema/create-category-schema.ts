import z from 'zod'

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome obrigatório')
    .max(50, 'Nome muito longo'),
  parentId: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.uuid().optional(),
  ),
})

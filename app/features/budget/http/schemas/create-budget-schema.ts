import z from 'zod'

export const createBudgetSchema = z.object({
  categoryId: z.uuid(),
  limitAmount: z.coerce.number().positive(),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1999).default(new Date().getFullYear()),
})

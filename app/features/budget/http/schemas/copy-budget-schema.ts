import z from 'zod'

export const copyBudgetSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1999).default(new Date().getFullYear()),
})

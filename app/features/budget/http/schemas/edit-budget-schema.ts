import z from 'zod'

export const editBudgetSchema = z.object({
  budgetId: z.uuid(),
  limitAmount: z.coerce.number().positive(),
})

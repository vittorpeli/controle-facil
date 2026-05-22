import z from 'zod'

export const deleteBudgetSchema = z.object({
  budgetId: z.uuid(),
})

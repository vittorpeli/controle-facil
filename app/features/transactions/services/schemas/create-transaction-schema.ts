import { z } from 'zod'

export const createTransactionSchema = z.object({
  accountId: z.uuid(),
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive(),
  date: z.coerce.date().optional().default(new Date()),
  categoryId: z.uuid().nullable(),
  description: z.string().nullable().optional(),
})

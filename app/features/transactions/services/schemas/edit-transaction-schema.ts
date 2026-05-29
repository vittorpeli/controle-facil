import z from 'zod'

export const editTransactionSchema = z.object({
  transactionId: z.uuid(),
  accountId: z.uuid(),
  categoryId: z.uuid().optional(),
  amount: z.coerce.number().positive().optional(),
  date: z.coerce.date().optional(),
  description: z.string().nullable().optional(),
})

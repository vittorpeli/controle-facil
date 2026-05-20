import z from 'zod'

export const createTransferSchema = z
  .object({
    fromAccountId: z.uuid(),
    toAccountId: z.uuid(),
    amount: z.coerce.number().positive(),
    date: z.coerce.date().optional().default(new Date()),
    description: z.string().nullable().optional(),
  })
  .refine((transfer) => transfer.toAccountId !== transfer.fromAccountId, {
    message: 'Conta de Origem e de Destino devem ser diferentes!',
    path: ['toAccountId'],
  })

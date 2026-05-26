import z from 'zod'

export const createContributionSchema = z.object({
  goalId: z.uuidv4(),
  accountId: z.uuidv4(),
  amount: z.coerce
    .number()
    .positive()
    .min(0.5, 'O valor de aporte deve ser igual ou maior que R$ 0,50'),
  date: z.coerce.date(),
  description: z.string().nullable().optional(),
})

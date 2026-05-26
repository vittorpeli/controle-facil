import z from 'zod'

export const updateGoalSchema = z.object({
  goalId: z.uuidv4(),
  name: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .max(50, 'Nome é muito longo'),
  targetAmount: z.coerce.number().positive(),
  deadline: z.coerce.date(),
  description: z.string().nullable().optional(),
})

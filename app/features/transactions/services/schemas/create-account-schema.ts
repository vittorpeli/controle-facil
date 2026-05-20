import { z } from 'zod'

export const createAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome obrigatório')
    .max(50, 'Nome muito longo'),
  type: z.enum([
    'cash',
    'checking',
    'credit_card',
    'investment',
    'savings',
    'other',
  ]),
  institution: z.string().trim().max(50).nullable().or(z.literal('')),
})

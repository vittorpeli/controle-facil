import z from 'zod'
import { accountTypeEnum } from '~/lib/db/schema'

export const editAccountSchema = z.object({
  accountId: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, 'Nome obrigatório')
    .max(50, 'Nome muito longo'),
  type: z.enum(accountTypeEnum),
  institution: z.string().trim().max(50).nullable().or(z.literal('')),
})

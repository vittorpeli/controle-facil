import z from 'zod'

export const archiveAccountSchema = z.object({
  accountId: z.uuid(),
})

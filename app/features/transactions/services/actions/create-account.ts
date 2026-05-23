import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeCreateAccountUseCase } from '../../application/use-cases/create-account'
import { DrizzleAccountsRepository } from '../drizzle-accounts-repository'
import { createAccountSchema } from '../schemas/create-account-schema'

export async function createAccountAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: createAccountSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const accountsRepository = new DrizzleAccountsRepository()

  const createAccount = makeCreateAccountUseCase(accountsRepository)

  await createAccount({
    userId,
    name: submission.value.name,
    type: submission.value.type,
    institution: submission.value.institution || null,
  })

  return Response.json({ success: true })
}

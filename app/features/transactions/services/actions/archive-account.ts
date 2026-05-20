import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { redirect } from 'react-router'
import { makeArchiveAccountUseCase } from '../../application/use-cases/archive-account'
import { DrizzleAccountsRepository } from '../drizzle-accounts-repository'
import { archiveAccountSchema } from '../schemas/archive-account-schema'

export async function archiveAccountAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: archiveAccountSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const accountsRepository = new DrizzleAccountsRepository()

  const archiveAccount = makeArchiveAccountUseCase(accountsRepository)

  await archiveAccount({
    accountId: submission.value.accountId as UUID,
    userId,
  })

  return redirect('/app/transactions')
}

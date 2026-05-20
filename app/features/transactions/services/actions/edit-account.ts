import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { redirect } from 'react-router'
import { makeEditAccountUseCase } from '../../application/use-cases/edit-account'
import { DrizzleAccountsRepository } from '../drizzle-accounts-repository'
import { editAccountSchema } from '../schemas/edit-account-schema'

export async function editAccountAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, { schema: editAccountSchema })

  if (submission.status !== 'success') return submission.reply()

  const accountsRepository = new DrizzleAccountsRepository()

  const editAccount = makeEditAccountUseCase(accountsRepository)

  await editAccount({
    accountId: submission.value.accountId as UUID,
    userId,
    name: submission.value.name,
  })

  return redirect('/app/transactions')
}

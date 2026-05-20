import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { redirect } from 'react-router'
import { makeCreateTransferUseCase } from '../../application/use-cases/create-transfer'
import { DrizzleAccountsRepository } from '../drizzle-accounts-repository'
import { DrizzleTransactionsRepository } from '../drizzle-transactions-repository'
import { createTransferSchema } from '../schemas/create-transfer-schema'

export async function createTransferAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: createTransferSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const accountsRepository = new DrizzleAccountsRepository()
  const transactionsRepository = new DrizzleTransactionsRepository()

  const createTransfer = makeCreateTransferUseCase(
    accountsRepository,
    transactionsRepository,
  )

  await createTransfer({
    userId,
    fromAccountId: submission.value.fromAccountId as UUID,
    toAccountId: submission.value.toAccountId as UUID,
    amount: submission.value.amount,
    date: submission.value.date,
    description: submission.value.description ?? '',
  })

  return redirect('/app/transactions')
}

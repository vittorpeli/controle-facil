import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeCreateTransactionUseCase } from '../../application/use-cases/create-transaction'
import { DrizzleAccountsRepository } from '../drizzle-accounts-repository'
import { DrizzleTransactionsRepository } from '../drizzle-transactions-repository'
import { createTransactionSchema } from '../schemas/create-transaction-schema'

export async function createTransactionAction(
  formData: FormData,
  userId: UUID,
) {
  const submission = parseWithZod(formData, {
    schema: createTransactionSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const accountsRepository = new DrizzleAccountsRepository()
  const transactionsRepository = new DrizzleTransactionsRepository()

  const createTransaction = makeCreateTransactionUseCase(
    accountsRepository,
    transactionsRepository,
  )

  await createTransaction({
    userId,
    accountId: submission.value.accountId as UUID,
    type: submission.value.type,
    amount: submission.value.amount,
    date: submission.value.date,
    categoryId: submission.value.categoryId as UUID,
    description: submission.value.description,
  })

  return Response.json({ success: true })
}

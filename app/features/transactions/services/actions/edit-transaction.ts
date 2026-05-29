import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeEditTransactionUseCase } from '../../application/use-cases/edit-transaction'
import { DrizzleTransactionsRepository } from '../drizzle-transactions-repository'
import { editTransactionSchema } from '../schemas/edit-transaction-schema'

export async function editTransactionAction(formData: FormData, userId: UUID) {
  const submission = parseWithZod(formData, {
    schema: editTransactionSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const transactionsRepository = new DrizzleTransactionsRepository()
  const editTransaction = makeEditTransactionUseCase(transactionsRepository)

  await editTransaction({
    id: submission.value.transactionId as UUID,
    userId,
    accountId: submission.value.accountId as UUID,
    categoryId: submission.value.categoryId as UUID,
    amount: submission.value.amount,
    date: submission.value.date,
    description: submission.value.description,
  })

  return Response.json({ success: true })
}

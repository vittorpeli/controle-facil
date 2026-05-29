import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { makeDeleteTransactionUseCase } from '../../application/use-cases/delete-transaction'
import { DrizzleTransactionsRepository } from '../drizzle-transactions-repository'
import { deleteTransactionSchema } from '../schemas/delete-transaction-schema'

export async function deleteTransactionAction(
  formData: FormData,
  userId: UUID,
) {
  const submission = parseWithZod(formData, {
    schema: deleteTransactionSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const transactionsRepository = new DrizzleTransactionsRepository()
  const deleteTransaction = makeDeleteTransactionUseCase(transactionsRepository)

  await deleteTransaction({
    userId,
    id: submission.value.transactionId as UUID,
  })

  return Response.json({
    success: true,
    message: 'Transaction deleted with success!',
  })
}

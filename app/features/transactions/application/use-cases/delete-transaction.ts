import type { UUID } from 'node:crypto'
import type { TransactionsRepository } from '../ports/transactions-repository'

interface DeleteTransactionRequest {
  userId: UUID
  id: UUID
}

export const makeDeleteTransactionUseCase = (
  transactionsRepository: TransactionsRepository,
) => {
  return async ({ userId, id }: DeleteTransactionRequest): Promise<void> => {
    const transaction = await transactionsRepository.findById(id)
    if (!transaction) throw new Error('transaction not found')
    if (transaction.userId !== userId) throw new Error('unauthorized')

    await transactionsRepository.delete(transaction.id)
  }
}

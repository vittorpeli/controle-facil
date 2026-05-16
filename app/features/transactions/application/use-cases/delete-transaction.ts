import type { UUID } from 'node:crypto'
import type { TransactionsRepository } from '../ports/transactions-repository'

interface DeleteTransactionRequest {
  id: UUID
}

export const makeDeleteTransactionUseCase = (
  transactionsRepository: TransactionsRepository,
) => {
  return async ({ id }: DeleteTransactionRequest): Promise<void> => {
    const transaction = await transactionsRepository.findById(id)
    if (!transaction) throw new Error('transaction not found')

    await transactionsRepository.delete(transaction.id)
  }
}

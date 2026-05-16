import type { UUID } from 'node:crypto'
import type { Transaction } from '../../core/transaction'
import type { TransactionsRepository } from '../ports/transactions-repository'

interface EditTransactionRequest {
  id: UUID
  userId: UUID
  accountId?: UUID
  categoryId?: UUID
  amount?: number
  date?: Date
  description?: string | null
}

interface EditTransactionResponse {
  transaction: Transaction
}

export const makeEditTransactionUseCase = (
  transactionsRepository: TransactionsRepository,
) => {
  return async ({
    id,
    userId,
    accountId,
    categoryId,
    amount,
    date,
    description,
  }: EditTransactionRequest): Promise<EditTransactionResponse> => {
    const transaction = await transactionsRepository.findById(id)
    if (!transaction) throw new Error('transaction not found')
    if (transaction.userId !== userId) throw new Error('unauthorized')

    const updatedTransaction = await transactionsRepository.update({
      ...transaction,
      accountId: accountId ?? transaction.accountId,
      categoryId: categoryId ?? transaction.categoryId,
      amount: amount ?? transaction.amount,
      date: date ?? transaction.date,
      description: description ?? transaction.description,
    })

    return { transaction: updatedTransaction }
  }
}

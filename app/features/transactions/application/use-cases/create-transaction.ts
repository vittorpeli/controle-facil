import { randomUUID, type UUID } from 'node:crypto'
import type { Transaction } from '../../core/transaction'
import type { AccountsRepository } from '../ports/accounts-repository'
import type { TransactionsRepository } from '../ports/transactions-repository'

interface CreateTransactionRequest {
  userId: UUID
  accountId: UUID
  type: 'income' | 'expense'
  amount: number
  date?: Date
  categoryId: UUID
  description?: string | null
}

interface CreateTransactionResponse {
  transaction: Transaction
}

export const makeCreateTransactionUseCase = (
  accountsRepository: AccountsRepository,
  transactionsRepository: TransactionsRepository,
) => {
  return async ({
    userId,
    accountId,
    type,
    amount,
    date = new Date(),
    categoryId,
    description = null,
  }: CreateTransactionRequest): Promise<CreateTransactionResponse> => {
    if (amount <= 0)
      throw new Error('transaction amount must be greater than 0')

    const account = await accountsRepository.findById(accountId)
    if (!account) throw new Error('account not found')
    if (account.userId !== userId) throw new Error('unauthorized')

    const transaction = await transactionsRepository.create({
      id: randomUUID() as UUID,
      userId,
      accountId,
      type,
      transferGroupId: null,
      amount,
      date,
      categoryId,
      description,
      goalId: null,
      status: 'cleared',
      createdAt: new Date(),
    })

    return { transaction }
  }
}

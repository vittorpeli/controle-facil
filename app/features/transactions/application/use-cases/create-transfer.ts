import { randomUUID, type UUID } from 'node:crypto'
import type { Transaction } from '../../core/transaction'
import type { AccountsRepository } from '../ports/accounts-repository'
import type { TransactionsRepository } from '../ports/transactions-repository'

interface CreateTransferRequest {
  userId: UUID
  fromAccountId: UUID
  toAccountId: UUID
  amount: number
  date: Date
  description: string | null
}

interface CreateTransferResponse {
  outbound: Transaction
  inbound: Transaction
}

export const makeCreateTransferUseCase = (
  accountsRepository: AccountsRepository,
  transactionsRepository: TransactionsRepository,
) => {
  return async ({
    userId,
    fromAccountId,
    toAccountId,
    amount,
    date,
    description,
  }: CreateTransferRequest): Promise<CreateTransferResponse> => {
    if (amount <= 0) {
      throw new Error('amount must be greater than zero')
    }

    if (fromAccountId === toAccountId) {
      throw new Error('source and destination accounts must be different')
    }

    const sourceAccount = await accountsRepository.findById(fromAccountId)
    if (!sourceAccount) throw new Error('source account not found')
    if (sourceAccount.userId !== userId) throw new Error('unauthorized')

    const destinationAccount = await accountsRepository.findById(toAccountId)
    if (!destinationAccount) throw new Error('destination account not found')
    if (destinationAccount.userId !== userId) throw new Error('unauthorized')

    const transferGroupId = randomUUID() as UUID
    const now = new Date()

    const base = {
      userId,
      amount,
      date,
      description,
      categoryId: null,
      goalId: null,
      transferGroupId,
      status: 'cleared' as const,
      createdAt: now,
    }

    const outbound: Transaction = {
      ...base,
      id: randomUUID() as UUID,
      accountId: fromAccountId,
      type: 'transfer_out',
    }

    const inbound: Transaction = {
      ...base,
      id: randomUUID() as UUID,
      accountId: toAccountId,
      type: 'transfer_in',
    }

    return transactionsRepository.createTransfer({ outbound, inbound })
  }
}

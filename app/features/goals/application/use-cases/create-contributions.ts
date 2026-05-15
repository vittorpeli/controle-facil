import { randomUUID, type UUID } from 'node:crypto'
import type { AccountsRepository } from '~/features/transactions/application/ports/accounts-repository'
import type { TransactionsRepository } from '~/features/transactions/application/ports/transactions-repository'
import type { Transaction } from '~/features/transactions/core/transaction'
import type { GoalsRepository } from '../ports/goals-repository'

interface CreateContributionRequest {
  userId: UUID
  goalId: UUID
  accountId: UUID
  amount: number
  date: Date
  description?: string | null
}

interface CreateContributionResponse {
  transaction: Transaction
}

export const makeCreateContributionUseCase = (
  goalsRepository: GoalsRepository,
  accountsRepository: AccountsRepository,
  transactionsRepository: TransactionsRepository,
) => {
  return async ({
    userId,
    goalId,
    accountId,
    amount,
    date,
    description = null,
  }: CreateContributionRequest): Promise<CreateContributionResponse> => {
    if (amount <= 0) throw new Error('amount must be greater than zero')

    const goal = await goalsRepository.findById(goalId)
    if (!goal) throw new Error('goal not found')
    if (goal.userId !== userId) throw new Error('unauthorized')

    const account = await accountsRepository.findById(accountId)
    if (!account) throw new Error('account not found')
    if (account.userId !== userId) throw new Error('unauthorized')
    if (account.isArchived) throw new Error('account is archived')

    const transaction = await transactionsRepository.create({
      id: randomUUID() as UUID,
      userId,
      accountId,
      goalId,
      type: 'contribution',
      amount,
      date,
      description,
      categoryId: null,
      transferGroupId: null,
      status: 'cleared',
      createdAt: new Date(),
    })

    return { transaction }
  }
}

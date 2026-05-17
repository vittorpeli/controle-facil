import { randomUUID, type UUID } from 'node:crypto'
import type { TransactionsRepository } from '~/features/transactions/application/ports/transactions-repository'
import type { Transaction } from '~/features/transactions/core/transaction'
import type { Occurrence } from '../../core/occurrence'
import type { OccurrencesRepository } from '../ports/occurrences-repository'
import type { RecurrencesRepository } from '../ports/recurrences-repository'

interface ConfirmRecurrencePaymentRequest {
  occurrenceId: UUID
  amount: number
  performedAt: Date
  accountId?: UUID
  userId: UUID
}

interface ConfirmRecurrencePaymentResponse {
  transaction: Transaction
  occurrence: Occurrence
}

export const makeConfirmRecurrencePaymentUseCase = (
  occurrencesRepository: OccurrencesRepository,
  transactionsRepository: TransactionsRepository,
  recurrencesRepository: RecurrencesRepository,
) => {
  return async ({
    occurrenceId,
    performedAt,
    amount,
    userId,
    accountId,
  }: ConfirmRecurrencePaymentRequest): Promise<ConfirmRecurrencePaymentResponse> => {
    const occurrence = await occurrencesRepository.findById(occurrenceId)
    if (!occurrence) throw new Error('occurrence not found')

    const recurrence = await recurrencesRepository.findById(
      occurrence.recurrenceId,
    )
    if (!recurrence) throw new Error('recurrence not found')
    if (recurrence.userId !== userId) throw new Error('unauthorized')

    if (occurrence.status === 'paid')
      throw new Error('occurrence payment already confirmed')
    if (occurrence.status === 'skipped')
      throw new Error('skipped occurrence cannot be paid')

    const transaction = await transactionsRepository.create({
      id: randomUUID() as UUID,
      userId,
      type: 'expense',
      amount,
      accountId: accountId ?? recurrence.accountId,
      categoryId: recurrence.categoryId,
      description: `Pagamento recorrente de ${recurrence.name}`,
      transferGroupId: null,
      goalId: null,
      status: 'cleared',
      date: performedAt,
      createdAt: new Date(),
    })

    const updatedOccurrence = await occurrencesRepository.update({
      ...occurrence,
      status: 'paid',
      transactionId: transaction.id,
    })

    return { transaction, occurrence: updatedOccurrence }
  }
}

import { randomUUID, type UUID } from 'node:crypto'
import type { Frequency, Recurrence } from '../../core/recurrence'
import type { RecurrencesRepository } from '../ports/recurrences-repository'

interface CreateRecurrenceRequest {
  userId: UUID
  name: string
  amount: number
  frequency: Frequency
  dueDay?: number | null
  accountId: UUID
  categoryId?: UUID | null
  isSubscription: boolean
}

interface CreateRecurrenceResponse {
  recurrence: Recurrence
}

export const makeCreateRecurrenceUseCase = (
  recurrencesRepository: RecurrencesRepository,
) => {
  return async ({
    userId,
    name,
    amount,
    frequency,
    dueDay = null,
    accountId,
    categoryId,
    isSubscription = false,
  }: CreateRecurrenceRequest): Promise<CreateRecurrenceResponse> => {
    if (!name.trim()) throw new Error('name cannot be empty')

    if (frequency !== 'monthly' && dueDay)
      throw new Error(
        'due day is only defined at monthly recurrences or subscriptions',
      )

    const recurrence = await recurrencesRepository.create({
      id: randomUUID() as UUID,
      userId,
      name,
      amount,
      frequency,
      dueDay: dueDay ?? null,
      accountId,
      categoryId: categoryId ?? null,
      isSubscription,
      createdAt: new Date(),
    })

    return { recurrence }
  }
}

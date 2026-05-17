import type { UUID } from 'node:crypto'
import { getNextDueDate } from '../../services/getNextDueDate'
import type { RecurrenceWithStatus } from '../dtos/recurrence-with-status'
import type { OccurrencesRepository } from '../ports/occurrences-repository'
import type { RecurrencesRepository } from '../ports/recurrences-repository'

type ListFilter = 'recurrence' | 'subscription'

interface ListRecurrencesRequest {
  userId: UUID
  listFilter: ListFilter
}

interface ListRecurrencesResponse {
  recurrencesWithStatus: RecurrenceWithStatus[]
}

export const makeListRecurrencesUseCase = (
  recurrencesRepository: RecurrencesRepository,
  occurrencesRepository: OccurrencesRepository,
) => {
  return async ({
    userId,
    listFilter,
  }: ListRecurrencesRequest): Promise<ListRecurrencesResponse> => {
    const recurrences = await recurrencesRepository.findAllByUserId(userId)

    const filteredRecurrences = recurrences.filter((r) => {
      if (listFilter === 'subscription') {
        return r.isSubscription
      }

      return !r.isSubscription
    })

    const currentDate = new Date()

    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const recurrencesWithStatus: RecurrenceWithStatus[] = await Promise.all(
      filteredRecurrences.map(async (recurrence) => {
        const occurrence =
          await occurrencesRepository.findByRecurrenceIdAndDate(
            recurrence.id,
            currentMonth,
            currentYear,
          )

        return {
          ...recurrence,
          monthStatus: occurrence?.status ?? 'pending',
          nextDueDate: getNextDueDate(recurrence),
        }
      }),
    )

    return { recurrencesWithStatus }
  }
}

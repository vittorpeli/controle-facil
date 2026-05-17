import type { UUID } from 'node:crypto'
import type { Occurrence } from '../../core/occurrence'
import type { OccurrencesRepository } from '../ports/occurrences-repository'
import type { RecurrencesRepository } from '../ports/recurrences-repository'

interface IgnoreRecurrenceOccurrenceRequest {
  occurrenceId: UUID
  userId: UUID
}

interface IgnoreRecurrenceOccurrenceResponse {
  occurrence: Occurrence
}

export const makeIgnoreRecurrenceOccurrenceUseCase = (
  occurrencesRepository: OccurrencesRepository,
  recurrencesRepository: RecurrencesRepository,
) => {
  return async ({
    occurrenceId,
    userId,
  }: IgnoreRecurrenceOccurrenceRequest): Promise<IgnoreRecurrenceOccurrenceResponse> => {
    const occurrence = await occurrencesRepository.findById(occurrenceId)
    if (!occurrence) throw new Error('occurrence not found')

    const recurrence = await recurrencesRepository.findById(
      occurrence.recurrenceId,
    )
    if (!recurrence) throw new Error('recurrence not found')
    if (recurrence.userId !== userId) throw new Error('unauthorized')

    if (occurrence.status === 'paid')
      throw new Error('paid occurrence cannot be skipped')
    if (occurrence.status === 'skipped')
      throw new Error('occurrence already skipped')

    const updatedOccurrence = await occurrencesRepository.update({
      ...occurrence,
      status: 'skipped',
    })

    return { occurrence: updatedOccurrence }
  }
}

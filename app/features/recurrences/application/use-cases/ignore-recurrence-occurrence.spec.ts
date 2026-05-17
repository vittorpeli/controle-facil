import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeOccurrence, makeRecurrence } from '~/tests/helpers'
import { InMemoryOccurencesRepository } from '~/tests/repositories/in-memory-occurences-repository'
import { InMemoryRecurrencesRepository } from '~/tests/repositories/in-memory-recurrences-repository'
import { makeIgnoreRecurrenceOccurrenceUseCase } from './ignore-recurrence-occurrence'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let occurrencesRepository: InMemoryOccurencesRepository
let recurrencesRepository: InMemoryRecurrencesRepository
let sut: ReturnType<typeof makeIgnoreRecurrenceOccurrenceUseCase>

describe('Confirm recurrence payment Use Case', () => {
  beforeEach(() => {
    occurrencesRepository = new InMemoryOccurencesRepository()
    recurrencesRepository = new InMemoryRecurrencesRepository()
    sut = makeIgnoreRecurrenceOccurrenceUseCase(
      occurrencesRepository,
      recurrencesRepository,
    )
  })

  it('should be able to skip a recurrence occurrence', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'pending',
    })

    const { occurrence: updatedOccurrence } = await sut({
      occurrenceId: occurrence.id,
      userId: USER_ID,
    })

    expect(updatedOccurrence.status).toBe('skipped')
  })

  it('should not skip an inexistent occurrence', async () => {
    await expect(() =>
      sut({
        occurrenceId: randomUUID() as UUID,
        userId: USER_ID,
      }),
    ).rejects.toThrow('occurrence not found')
  })

  it('should not skip an already paid occurrence', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'paid',
    })

    await expect(() =>
      sut({
        occurrenceId: occurrence.id,
        userId: USER_ID,
      }),
    ).rejects.toThrow('paid occurrence cannot be skipped')
  })

  it('should not skip an already skipped occurrence', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'skipped',
    })

    await expect(() =>
      sut({
        occurrenceId: occurrence.id,
        userId: USER_ID,
      }),
    ).rejects.toThrow('occurrence already skipped')
  })

  it('should not allow users to skip occurrences from another user', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'pending',
    })

    await expect(() =>
      sut({
        occurrenceId: occurrence.id,
        userId: OTHER_USER_ID,
      }),
    ).rejects.toThrow('unauthorized')
  })
})

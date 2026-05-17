import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeOccurrence, makeRecurrence } from '~/tests/helpers'
import { InMemoryOccurencesRepository } from '~/tests/repositories/in-memory-occurences-repository'
import { InMemoryRecurrencesRepository } from '~/tests/repositories/in-memory-recurrences-repository'
import { makeListRecurrencesUseCase } from './list-recurrences'

const USER_ID = randomUUID() as UUID

let recurrencesRepository: InMemoryRecurrencesRepository
let occurrencesRepository: InMemoryOccurencesRepository
let sut: ReturnType<typeof makeListRecurrencesUseCase>

describe('List recurrences Use Case', () => {
  beforeEach(() => {
    recurrencesRepository = new InMemoryRecurrencesRepository()
    occurrencesRepository = new InMemoryOccurencesRepository()
    sut = makeListRecurrencesUseCase(
      recurrencesRepository,
      occurrencesRepository,
    )
  })

  it('should be able to list all recurrences from user', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository, {
      isSubscription: false,
    })
    await makeRecurrence(USER_ID, recurrencesRepository, {
      isSubscription: true,
    })

    const { recurrencesWithStatus: recurrences } = await sut({
      userId: USER_ID,
      listFilter: 'recurrence',
    })

    expect(recurrences).toHaveLength(1)
    expect(recurrences[0].id).toBe(recurrence.id)
  })

  it('should return an empty array when the user has no recurrences', async () => {
    const { recurrencesWithStatus } = await sut({
      userId: USER_ID,
      listFilter: 'recurrence',
    })

    expect(recurrencesWithStatus).toHaveLength(0)
  })

  it('should be able to list all subscriptions from user', async () => {
    await makeRecurrence(USER_ID, recurrencesRepository, {
      isSubscription: false,
    })
    const subscription = await makeRecurrence(USER_ID, recurrencesRepository, {
      isSubscription: true,
    })

    const { recurrencesWithStatus: subscriptions } = await sut({
      userId: USER_ID,
      listFilter: 'subscription',
    })

    expect(subscriptions).toHaveLength(1)
    expect(subscriptions[0].id).toBe(subscription.id)
  })

  it('should return an empty array when the user has no subscriptions', async () => {
    const { recurrencesWithStatus } = await sut({
      userId: USER_ID,
      listFilter: 'subscription',
    })

    expect(recurrencesWithStatus).toHaveLength(0)
  })

  it('should show the month payment status for each of the list recurrence', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository, {
      isSubscription: false,
    })

    await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      referenceMonth: new Date().getMonth() + 1,
      referenceYear: new Date().getFullYear(),
      status: 'paid',
    })

    const { recurrencesWithStatus: recurrences } = await sut({
      userId: USER_ID,
      listFilter: 'recurrence',
    })

    expect(recurrences).toHaveLength(1)
    expect(recurrences[0].monthStatus).toBe('paid')
  })

  it('should return pending when recurrence has no occurrence for current month', async () => {
    await makeRecurrence(USER_ID, recurrencesRepository, {
      isSubscription: false,
    })

    const { recurrencesWithStatus } = await sut({
      userId: USER_ID,
      listFilter: 'recurrence',
    })

    expect(recurrencesWithStatus[0].monthStatus).toBe('pending')
  })

  it('should calculate next monthly due date correctly', async () => {
    await makeRecurrence(USER_ID, recurrencesRepository, {
      frequency: 'monthly',
      dueDay: 25,
    })

    const { recurrencesWithStatus } = await sut({
      userId: USER_ID,
      listFilter: 'recurrence',
    })

    expect(recurrencesWithStatus[0].nextDueDate).toBeInstanceOf(Date)
  })
})

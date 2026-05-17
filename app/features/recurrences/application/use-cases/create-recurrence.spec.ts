import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRecurrencesRepository } from '~/tests/repositories/in-memory-recurrences-repository'
import { makeCreateRecurrenceUseCase } from './create-recurrence'

const USER_ID = randomUUID() as UUID

let recurrencesRepository: InMemoryRecurrencesRepository
let sut: ReturnType<typeof makeCreateRecurrenceUseCase>

describe('Create budget Use Case', () => {
  beforeEach(() => {
    recurrencesRepository = new InMemoryRecurrencesRepository()
    sut = makeCreateRecurrenceUseCase(recurrencesRepository)
  })

  it('should be able to create a new recurrence', async () => {
    const { recurrence } = await sut({
      userId: USER_ID,
      name: 'Empréstimo Carro',
      amount: 200,
      frequency: 'monthly',
      dueDay: 5,
      accountId: randomUUID() as UUID,
      isSubscription: false,
    })

    expect(recurrence.id).toBeDefined()
    expect(recurrence.name).toBe('Empréstimo Carro')
    expect(recurrence.dueDay).toBe(5)
    expect(recurrencesRepository.items).toHaveLength(1)
    expect(recurrencesRepository.items[0].id).toBe(recurrence.id)
  })

  it('should be able to create a subscription recurrence', async () => {
    const { recurrence } = await sut({
      userId: USER_ID,
      name: 'Netflix',
      amount: 200,
      frequency: 'monthly',
      dueDay: 5,
      accountId: randomUUID() as UUID,
      isSubscription: true,
    })

    expect(recurrence.id).toBeDefined()
    expect(recurrence.name).toBe('Netflix')
    expect(recurrence.isSubscription).toBeTruthy()
  })

  it('should set dueDay as null if frequency is not monthly', async () => {
    const { recurrence } = await sut({
      userId: USER_ID,
      name: 'Netflix',
      amount: 200,
      frequency: 'quarterly',
      accountId: randomUUID() as UUID,
      isSubscription: true,
    })

    expect(recurrence.id).toBeDefined()
    expect(recurrence.name).toBe('Netflix')
    expect(recurrence.isSubscription).toBeTruthy()
  })

  it('should throw if trying to set dueDay for recurrency that is not monthly', async () => {
    await expect(
      sut({
        userId: USER_ID,
        name: 'Empréstimo Carro',
        amount: 200,
        frequency: 'quarterly',
        dueDay: 5,
        accountId: randomUUID() as UUID,
        isSubscription: false,
      }),
    ).rejects.toThrow(
      'due day is only defined at monthly recurrences or subscriptions',
    )
  })

  it('should set category as null if not defined', async () => {
    const { recurrence } = await sut({
      userId: USER_ID,
      name: 'Empréstimo Carro',
      amount: 200,
      frequency: 'monthly',
      dueDay: 5,
      accountId: randomUUID() as UUID,
      isSubscription: false,
    })

    expect(recurrence.categoryId).toBeNull()
  })
})

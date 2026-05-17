import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeOccurrence, makeRecurrence } from '~/tests/helpers'
import { InMemoryOccurencesRepository } from '~/tests/repositories/in-memory-occurences-repository'
import { InMemoryRecurrencesRepository } from '~/tests/repositories/in-memory-recurrences-repository'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeConfirmRecurrencePaymentUseCase } from './confirm-recurrence-payment'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let occurrencesRepository: InMemoryOccurencesRepository
let transactionsRepository: InMemoryTransactionsRepository
let recurrencesRepository: InMemoryRecurrencesRepository
let sut: ReturnType<typeof makeConfirmRecurrencePaymentUseCase>

describe('Confirm recurrence payment Use Case', () => {
  beforeEach(() => {
    occurrencesRepository = new InMemoryOccurencesRepository()
    transactionsRepository = new InMemoryTransactionsRepository()
    recurrencesRepository = new InMemoryRecurrencesRepository()
    sut = makeConfirmRecurrencePaymentUseCase(
      occurrencesRepository,
      transactionsRepository,
      recurrencesRepository,
    )
  })

  it('should be able to confirm a recurrence payment', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'pending',
    })

    const { transaction, occurrence: updatedOccurence } = await sut({
      occurrenceId: occurrence.id,
      userId: USER_ID,
      amount: recurrence.amount,
      performedAt: new Date(),
      accountId: recurrence.accountId,
    })

    expect(transaction).toBeDefined()
    expect(updatedOccurence.status).toBe('paid')
    expect(updatedOccurence.transactionId).toBe(transaction.id)
  })

  it('should be create a real expense transaction', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'pending',
    })

    const { transaction } = await sut({
      occurrenceId: occurrence.id,
      userId: USER_ID,
      amount: recurrence.amount,
      performedAt: new Date(),
      accountId: recurrence.accountId,
    })

    expect(transaction.type).toBe('expense')
    expect(transaction.amount).toBe(recurrence.amount)
    expect(transaction.categoryId).toBe(recurrence.categoryId)
  })

  it('should not be able to confirm an inexistent occurrence', async () => {
    await expect(() =>
      sut({
        occurrenceId: randomUUID() as UUID,
        userId: USER_ID,
        amount: 100,
        performedAt: new Date(),
        accountId: randomUUID() as UUID,
      }),
    ).rejects.toThrow('occurrence not found')
  })

  it('should not be able to confirm an already paid occurrence', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'paid',
    })

    await expect(() =>
      sut({
        occurrenceId: occurrence.id,
        userId: USER_ID,
        amount: recurrence.amount,
        performedAt: new Date(),
        accountId: recurrence.accountId,
      }),
    ).rejects.toThrow('occurrence payment already confirmed')
  })

  it('should not confirm an skipped occurrence', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'skipped',
    })

    await expect(() =>
      sut({
        occurrenceId: occurrence.id,
        userId: USER_ID,
        amount: recurrence.amount,
        performedAt: new Date(),
        accountId: recurrence.accountId,
      }),
    ).rejects.toThrow('skipped occurrence cannot be paid')
  })

  it('should not allow users to confirm occurrences from another user', async () => {
    const recurrence = await makeRecurrence(USER_ID, recurrencesRepository)

    const occurrence = await makeOccurrence(occurrencesRepository, {
      recurrenceId: recurrence.id,
      status: 'pending',
    })

    await expect(() =>
      sut({
        occurrenceId: occurrence.id,
        userId: OTHER_USER_ID,
        amount: recurrence.amount,
        performedAt: new Date(),
        accountId: recurrence.accountId,
      }),
    ).rejects.toThrow('unauthorized')
  })
})

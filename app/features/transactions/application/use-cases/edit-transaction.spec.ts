import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeTransaction } from '~/tests/helpers'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeEditTransactionUseCase } from './edit-transaction'

const USER_ID = randomUUID() as UUID

let transactionsRepository: InMemoryTransactionsRepository
let sut: ReturnType<typeof makeEditTransactionUseCase>

describe('Edit transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = makeEditTransactionUseCase(transactionsRepository)
  })

  it('should be able to edit a transaction', async () => {
    const transaction = await makeTransaction(USER_ID, transactionsRepository)

    const { transaction: updatedTransaction } = await sut({
      id: transaction.id,
      userId: USER_ID,
      amount: 2000,
      description: 'Change transaction amount',
    })

    expect(updatedTransaction.id).toBe(transaction.id)
    expect(updatedTransaction.amount).toBe(2000)
  })
})

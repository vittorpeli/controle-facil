import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeTransaction } from '~/tests/helpers'
import { InMemoryTransactionsRepository } from '~/tests/repositories/in-memory-transactions-repository'
import { makeDeleteTransactionUseCase } from './delete-transaction'

const USER_ID = randomUUID() as UUID

let transactionsRepository: InMemoryTransactionsRepository
let sut: ReturnType<typeof makeDeleteTransactionUseCase>

describe('Delete transaction Use Case', () => {
  beforeEach(() => {
    transactionsRepository = new InMemoryTransactionsRepository()
    sut = makeDeleteTransactionUseCase(transactionsRepository)
  })

  it('should be able to delete a transaction', async () => {
    const transaction = await makeTransaction(USER_ID, transactionsRepository)

    await sut({ id: transaction.id })

    expect(transactionsRepository.transactions).toHaveLength(0)
  })
})

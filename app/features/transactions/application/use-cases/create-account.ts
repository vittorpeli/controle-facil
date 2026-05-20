import { randomUUID, type UUID } from 'node:crypto'
import type { AccountType } from '~/lib/db/schema'
import type { Account } from '../../core/account'
import type { AccountsRepository } from '../ports/accounts-repository'

interface CreateAccountRequest {
  userId: UUID
  name: string
  type: AccountType
  institution: string | null
}

interface CreateAccountResponse {
  account: Account
}

export const makeCreateAccountUseCase = (
  accountsRepository: AccountsRepository,
) => {
  return async ({
    userId,
    name,
    type,
    institution,
  }: CreateAccountRequest): Promise<CreateAccountResponse> => {
    const account = await accountsRepository.create({
      id: randomUUID() as UUID,
      userId,
      name,
      type,
      institution,
      isArchived: false,
      createdAt: new Date(),
    })

    return { account }
  }
}

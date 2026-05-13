import type { UUID } from 'node:crypto'
import type { AccountType } from '~/lib/db/schema'
import type { Account } from '../../core/account'
import type { AccountsRepository } from '../ports/accounts-repository'

interface EditAccountRequest {
  accountId: UUID
  userId: UUID
  name?: string
  type?: AccountType
  institution?: string | null
}

interface EditAccountResponse {
  account: Account
}

export const makeEditAccountUseCase = (
  accountsRepository: AccountsRepository,
) => {
  return async ({
    accountId,
    userId,
    name,
    type,
    institution,
  }: EditAccountRequest): Promise<EditAccountResponse> => {
    const account = await accountsRepository.findById(accountId)

    if (!account) throw new Error('account not found')

    if (account.userId !== userId) throw new Error('unauthorized')

    const updatedAccount = await accountsRepository.update({
      ...account,
      name: name ?? account.name,
      type: type ?? account.type,
      institution:
        institution !== undefined ? institution : account.institution,
    })

    return { account: updatedAccount }
  }
}

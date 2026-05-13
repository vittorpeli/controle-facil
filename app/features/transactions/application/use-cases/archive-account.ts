import type { UUID } from 'node:crypto'
import type { AccountsRepository } from '../ports/accounts-repository'

interface ArchiveAccountRequest {
  accountId: UUID
  userId: UUID
}

export const makeArchiveAccountUseCase = (
  accountsRepository: AccountsRepository,
) => {
  return async ({
    accountId,
    userId,
  }: ArchiveAccountRequest): Promise<void> => {
    const account = await accountsRepository.findById(accountId)

    if (!account) throw new Error('Account not found')

    if (account.userId !== userId) throw new Error('Unauthorized')

    if (account.isArchived) return

    await accountsRepository.update({ ...account, isArchived: true })
  }
}

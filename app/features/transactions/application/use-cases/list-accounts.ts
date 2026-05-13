import type { UUID } from 'node:crypto'
import type { AccountWithBalance } from '../../core/account'
import type { AccountsRepository } from '../ports/accounts-repository'
import type { TransactionsRepository } from '../ports/transactions-repository'

interface ListAccountsRequest {
  userId: UUID
}

interface ListAccountsResponse {
  accounts: AccountWithBalance[]
}

export const makeListAccountsUseCase = (
  accountsRepository: AccountsRepository,
  transactionsRepository: TransactionsRepository,
) => {
  return async ({
    userId,
  }: ListAccountsRequest): Promise<ListAccountsResponse> => {
    const allAccounts = await accountsRepository.findAllByUserId(userId)

    const activeAccounts = allAccounts.filter((account) => !account.isArchived)

    const accounts = await Promise.all(
      activeAccounts.map(async (account) => {
        const balance = await transactionsRepository.getBalanceByAccountId(
          account.id,
        )
        return { ...account, balance }
      }),
    )

    return { accounts }
  }
}

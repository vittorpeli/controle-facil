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
    const [allAccounts, balancesMap] = await Promise.all([
      accountsRepository.findAllByUserId(userId),
      transactionsRepository.getBalancesByUserId(userId),
    ])

    const accounts = allAccounts
      .filter((account) => !account.isArchived)
      .map((account) => ({
        ...account,
        balance: balancesMap.get(account.id) ?? 0,
      }))

    return { accounts }
  }
}

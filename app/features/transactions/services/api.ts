import { requireAuth } from '~/features/auth/services/require-auth'
import { makeListCategoriesUseCase } from '~/features/categories/application/use-cases/list-categories'
import { DrizzleCategoriesRepository } from '~/features/categories/services/drizzle-categories-repository'
import { makeListAccountsUseCase } from '~/features/transactions/application/use-cases/list-accounts'
import { makeListTransactionsUseCase } from '~/features/transactions/application/use-cases/list-transactions'
import { DrizzleAccountsRepository } from '~/features/transactions/services/drizzle-accounts-repository'
import { DrizzleTransactionsRepository } from '~/features/transactions/services/drizzle-transactions-repository'
import { archiveAccountAction } from './actions/archive-account'
import { createAccountAction } from './actions/create-account'
import { createTransactionAction } from './actions/create-transaction'
import { createTransferAction } from './actions/create-transfer'
import { editAccountAction } from './actions/edit-account'
import { editTransactionAction } from './actions/edit-transaction'

type LoaderArgs = {
  request: Request
}

type ActionArgs = {
  request: Request
  params: Record<string, string | undefined>
}

export async function loader({ request }: LoaderArgs) {
  const user = await requireAuth(request)

  const accountsRepository = new DrizzleAccountsRepository()
  const transactionsRepository = new DrizzleTransactionsRepository()
  const categoriesRepository = new DrizzleCategoriesRepository()

  const listAccounts = makeListAccountsUseCase(
    accountsRepository,
    transactionsRepository,
  )
  const listTransactions = makeListTransactionsUseCase(transactionsRepository)
  const listCategories = makeListCategoriesUseCase(categoriesRepository)

  const [{ accounts }, { transactions }, { categories }] = await Promise.all([
    listAccounts({ userId: user.id }),
    listTransactions({ userId: user.id }),
    listCategories({ userId: user.id, includeArchived: false }),
  ])

  return { accounts, transactions, categories }
}

export async function action({ request }: ActionArgs) {
  const user = await requireAuth(request)

  const formData = await request.formData()

  const intent = formData.get('intent')

  switch (intent) {
    case 'create-account':
      return createAccountAction(formData, user.id)

    case 'archive-account':
      return archiveAccountAction(formData, user.id)

    case 'edit-account':
      return editAccountAction(formData, user.id)

    case 'create-transaction':
      return createTransactionAction(formData, user.id)

    case 'create-transfer':
      return createTransferAction(formData, user.id)

    case 'edit-transaction':
      return editTransactionAction(formData, user.id)

    default:
      throw new Error('invalid intent')
  }
}

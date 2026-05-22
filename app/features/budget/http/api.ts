import { requireAuth } from '~/features/auth/services/require-auth'
import { makeListCategoriesUseCase } from '~/features/categories/application/use-cases/list-categories'
import { DrizzleCategoriesRepository } from '~/features/categories/services/drizzle-categories-repository'
import { DrizzleTransactionsRepository } from '~/features/transactions/services/drizzle-transactions-repository'
import { makeGetBudgetProgressUseCase } from '../application/use-cases/get-budget-progress'
import { DrizzleBudgetsRepository } from '../services/drizzle-budgets-repository'
import { copyBudgetAction } from './actions/copy-budget-action'
import { createBudgetAction } from './actions/create-budget-action'
import { deleteBudgetAction } from './actions/delete-budget-action'

type LoaderArgs = {
  request: Request
}

type ActionArgs = {
  request: Request
  params: Record<string, string | undefined>
}

export async function loader({ request }: LoaderArgs) {
  const user = await requireAuth(request)
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()

  const budgetsRepository = new DrizzleBudgetsRepository()
  const categoriesRepository = new DrizzleCategoriesRepository()
  const transactionsRepository = new DrizzleTransactionsRepository()

  const listCategories = makeListCategoriesUseCase(categoriesRepository)
  const getBudgetsProgresses = makeGetBudgetProgressUseCase(
    budgetsRepository,
    transactionsRepository,
  )

  const [{ categories }, { budgetProgresses: budgets }] = await Promise.all([
    listCategories({ userId: user.id, includeArchived: false }),
    getBudgetsProgresses({
      userId: user.id,
      month: thisMonth,
      year: thisYear,
    }),
  ])

  const incomeCategory = categories.find(
    (c) => c.name.toLowerCase() === 'receita',
  )

  const expenseCategories = categories.filter(
    (c) => c.id !== incomeCategory?.id && c.parentId !== incomeCategory?.id,
  )

  return { expenseCategories, budgets }
}

export async function action({ request }: ActionArgs) {
  const user = await requireAuth(request)

  const formData = await request.formData()

  switch (formData.get('intent')) {
    case 'create-budget':
      return await createBudgetAction(formData, user.id)
    case 'copy-budget':
      return await copyBudgetAction(formData, user.id)
    case 'delete-budget':
      return await deleteBudgetAction(formData, user.id)
    default:
      throw new Error('Invalid intent')
  }
}

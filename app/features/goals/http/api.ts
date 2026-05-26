import { requireAuth } from '~/features/auth/services/require-auth'
import { makeListAccountsUseCase } from '~/features/transactions/application/use-cases/list-accounts'
import { DrizzleAccountsRepository } from '~/features/transactions/services/drizzle-accounts-repository'
import { DrizzleTransactionsRepository } from '~/features/transactions/services/drizzle-transactions-repository'
import type { Route } from '../../../routes/+types/app.goals'
import { makeListGoalsUseCase } from '../application/use-cases/list-goals'
import { DrizzleContributionsRepository } from '../services/drizzle-contributions-repository'
import { DrizzleGoalsRepository } from '../services/drizzle-goals-repository'
import { createContributionAction } from './actions/create-contribution-action'
import { createGoalAction } from './actions/create-goal-action'
import { deleteGoalAction } from './actions/delete-goal-action'
import { updateGoalAction } from './actions/update-goal-action'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)

  const goalsRepository = new DrizzleGoalsRepository()
  const contributionsRepository = new DrizzleContributionsRepository()
  const accountsRepository = new DrizzleAccountsRepository()
  const transactionsRepository = new DrizzleTransactionsRepository()

  const listGoals = makeListGoalsUseCase(
    goalsRepository,
    contributionsRepository,
  )

  const listAccounts = makeListAccountsUseCase(
    accountsRepository,
    transactionsRepository,
  )

  const [{ goals }, { accounts }] = await Promise.all([
    listGoals({ userId: user.id }),
    listAccounts({ userId: user.id }),
  ])

  return { goals, accounts }
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request)
  const formData = await request.formData()
  const intent = formData.get('intent')

  switch (intent) {
    case 'create-goal':
      return await createGoalAction(formData, user.id)
    case 'update-goal':
      return await updateGoalAction(formData, user.id)
    case 'delete-goal':
      return await deleteGoalAction(formData, user.id)
    case 'create-contribution':
      return await createContributionAction(formData, user.id)
    default:
      throw new Error('Invalid Intent')
  }
}

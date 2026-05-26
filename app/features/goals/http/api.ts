import { requireAuth } from '~/features/auth/services/require-auth'
import type { Route } from '../../../routes/+types/app.goals'
import { makeListGoalsUseCase } from '../application/use-cases/list-goals'
import { DrizzleContributionsRepository } from '../services/drizzle-contributions-repository'
import { DrizzleGoalsRepository } from '../services/drizzle-goals-repository'
import { createGoalAction } from './actions/create-goal-action'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)

  const goalsRepository = new DrizzleGoalsRepository()
  const contributionsRepository = new DrizzleContributionsRepository()
  const listGoals = makeListGoalsUseCase(
    goalsRepository,
    contributionsRepository,
  )

  const { goals } = await listGoals({ userId: user.id })

  return { goals }
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request)
  const formData = await request.formData()
  const intent = formData.get('intent')

  switch (intent) {
    case 'create-goal':
      return await createGoalAction(formData, user.id)
    default:
      throw new Error('Invalid Intent')
  }
}

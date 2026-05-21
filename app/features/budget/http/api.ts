import { requireAuth } from '~/features/auth/services/require-auth'
import { createBudgetAction } from './actions/create-budget-action'

type ActionArgs = {
  request: Request
  params: Record<string, string | undefined>
}

export async function action({ request }: ActionArgs) {
  const user = await requireAuth(request)

  const formData = await request.formData()

  await createBudgetAction(formData, user.id)
}

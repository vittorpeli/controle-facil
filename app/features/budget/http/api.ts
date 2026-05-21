import { requireAuth } from '~/features/auth/services/require-auth'
import { copyBudgetAction } from './actions/copy-budget-action'
import { createBudgetAction } from './actions/create-budget-action'

type ActionArgs = {
  request: Request
  params: Record<string, string | undefined>
}

export async function action({ request }: ActionArgs) {
  const user = await requireAuth(request)

  const formData = await request.formData()

  switch (formData.get('intent')) {
    case 'create-budget':
      return await createBudgetAction(formData, user.id)
    case 'copy-budget':
      return await copyBudgetAction(formData, user.id)
    default:
      throw new Error('Invalid intent')
  }
}

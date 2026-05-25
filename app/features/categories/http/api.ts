import { requireAuth } from '~/features/auth/services/require-auth'
import type { Route } from '../../../routes/+types/app.categories'
import { makeListCategoriesUseCase } from '../application/use-cases/list-categories'
import { DrizzleCategoriesRepository } from '../services/drizzle-categories-repository'
import { createCategoryAction } from './action/create-category-action'
import { editCategoryAction } from './action/edit-category-action'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)

  const categoriesRepository = new DrizzleCategoriesRepository()

  const listCategories = makeListCategoriesUseCase(categoriesRepository)

  const { categories } = await listCategories({
    userId: user.id,
    includeArchived: true,
  })

  const parentCategories = categories.filter((c) => c.parentId === null)

  return { categories, parentCategories }
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request)
  const formData = await request.formData()

  switch (formData.get('intent')) {
    case 'create-category':
      return await createCategoryAction(formData, user.id)
    case 'edit-category':
      return await editCategoryAction(formData, user.id)
    default:
      throw new Error('Invalid Intent')
  }
}

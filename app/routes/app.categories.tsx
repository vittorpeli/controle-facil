import { Archive, Plus, SquarePen } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { requireAuth } from '~/features/auth/services/require-auth'
import { makeListCategoriesUseCase } from '~/features/categories/application/use-cases/list-categories'
import { CategoryAccordion } from '~/features/categories/presentation/category-accordion'
import { DrizzleCategoriesRepository } from '~/features/categories/services/drizzle-categories-repository'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card'
import { Headline } from '~/ui/headline'
import type { Route } from './+types/app.categories'

export function meta() {
  return [
    { title: 'Categorias' },
    { name: 'Categorias', content: 'Budget Categories' },
  ]
}

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

export default function Categories() {
  const { categories, parentCategories } = useLoaderData<typeof loader>()

  return (
    <div className="flow">
      <Headline title="Todas Categorias">
        <Button
          style={
            {
              '--button-y-padding': '0.5em',
              '--button-x-padding': '0.5em',
            } as React.CSSProperties
          }
        >
          <Plus />
        </Button>
      </Headline>

      <CategoryAccordion parents={parentCategories} categories={categories} />
    </div>
  )
}

import { ArrowRight, Copy, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import { requireAuth } from '~/features/auth/services/require-auth'
import { makeListBudgetsUseCase } from '~/features/budget/application/use-cases/list-budgets'
import { action } from '~/features/budget/http/api'
import { BudgetForm } from '~/features/budget/presentation/budget-form'
import { DrizzleBudgetsRepository } from '~/features/budget/services/drizzle-budgets-repository'
import { makeListCategoriesUseCase } from '~/features/categories/application/use-cases/list-categories'
import { DrizzleCategoriesRepository } from '~/features/categories/services/drizzle-categories-repository'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card'
import { Header } from '~/ui/Header'
import { Headline } from '~/ui/headline'
import { BaseModal } from '~/ui/modal'
import type { Route } from './+types/app.budgets'

export function meta() {
  return [
    { title: 'Orçamentos' },
    { name: 'Orçamentos', content: 'Budgeting Page' },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()

  const budgetsRepository = new DrizzleBudgetsRepository()
  const categoriesRepository = new DrizzleCategoriesRepository()

  const listCategories = makeListCategoriesUseCase(categoriesRepository)
  const listBudgets = makeListBudgetsUseCase(budgetsRepository)

  const [{ categories }, { budgets }] = await Promise.all([
    listCategories({ userId: user.id, includeArchived: false }),
    listBudgets({
      userId: user.id,
      month: thisMonth,
      year: thisYear,
    }),
  ])

  return { categories, budgets }
}

export { action }

export default function Budgets() {
  const { categories, budgets } = useLoaderData<typeof loader>()
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

  return (
    <div className="mt-m flow flow-space-m">
      <Header
        title="Orçamentos"
        subtitle="Aloque seu patrimônio de forma eficiente e precisa"
        data-direction="reverse"
      />

      <Button
        data-button-variant="secondary"
        className="text-dark"
        onClick={() => setIsBudgetModalOpen(true)}
      >
        Criar Novo Orçamento
        <Plus />
        <BaseModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
        >
          <BudgetForm categories={categories} />
        </BaseModal>
      </Button>

      <div>
        <Headline title="Categorias - Mês Atual">
          <Link className="button" data-button-variant="link" to="/categories">
            Ver mais
            <ArrowRight />
          </Link>
        </Headline>

        <div className="grid mt-l mb-s-m">
          {categories.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <span>
                  Limite:{' '}
                  {`${budgets.find((b) => b.categoryId === c.id)?.limitAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'Não definido'}`}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-s-m">
          <Button data-button-variant="link">
            <Copy />
            Copiar Orçamentos do Mês Anterior
          </Button>
        </div>
      </div>
    </div>
  )
}

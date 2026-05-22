import { ArrowRight, Plus, SquarePen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import { action, loader } from '~/features/budget/http/api'
import { BudgetForm } from '~/features/budget/presentation/budget-form'
import { BudgetProgress } from '~/features/budget/presentation/budget-progress'
import { CopyBudgetLoader } from '~/features/budget/presentation/copy-budget-loader'
import { DeleteBudgetAlert } from '~/features/budget/presentation/delete-alert'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card'
import { Header } from '~/ui/Header'
import { Headline } from '~/ui/headline'
import { BaseModal } from '~/ui/modal'

export function meta() {
  return [
    { title: 'Orçamentos' },
    { name: 'Orçamentos', content: 'Budgeting Page' },
  ]
}

export { action, loader }

export default function Budgets() {
  const { expenseCategories, budgets } = useLoaderData<typeof loader>()

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [editBudget, setEditBudget] = useState(false)

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
          <BudgetForm categories={expenseCategories} />
        </BaseModal>
      </Button>

      <div>
        <Headline title="Categorias - Mês Atual">
          <Link className="button" data-button-variant="link" to="/categories">
            Ver tudo
            <ArrowRight />
          </Link>
        </Headline>

        <div className="reel mt-l mb-s-m">
          {expenseCategories.map((c) => (
            <Card key={c.id} className="flow">
              <CardHeader>
                <CardTitle className="font-bold">{c.name}</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-2xs">
                <div className="flex flex-row items-center gap-2xs">
                  <Button
                    data-button-variant="link"
                    onClick={() => setIsDelete(true)}
                  >
                    <Trash2 />
                  </Button>
                  <DeleteBudgetAlert
                    message="Você tem certeza que quer excluir esse orçamento?"
                    isOpen={isDelete}
                    onCancel={() => setIsDelete(false)}
                    budget={budgets.find((b) => b.categoryId === c.id)}
                  />

                  <Button
                    data-button-variant="link"
                    onClick={() => setEditBudget(true)}
                  >
                    <SquarePen />
                  </Button>
                  <BaseModal
                    isOpen={editBudget}
                    onClose={() => setEditBudget(true)}
                  >
                    <p>Editar</p>
                  </BaseModal>
                </div>
                <span className="font-mono font-medium mb-s">
                  Limite:{' '}
                  {`${budgets.find((b) => b.categoryId === c.id)?.limitAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'Não definido'}`}
                </span>
                <div>
                  <span className="font-mono font-medium text-step--1">
                    Valor gasto:{' '}
                    {`${budgets.find((b) => b.categoryId === c.id)?.spentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'Não definido'}`}
                  </span>
                  <BudgetProgress
                    progress={
                      budgets.find((b) => b.categoryId === c.id)
                        ?.progressPercentage ?? 0
                    }
                    status={
                      budgets.find((b) => b.categoryId === c.id)?.status ??
                      'safe'
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <CopyBudgetLoader />
      </div>
    </div>
  )
}

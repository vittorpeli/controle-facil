import {
  BanknoteArrowUp,
  Landmark,
  Plus,
  SquarePen,
  Trash,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { useLoaderData } from 'react-router'
import type { Goal } from '~/features/goals/core/goal'
import { action, loader } from '~/features/goals/http/api'
import { ContributionForm } from '~/features/goals/presentation/contribution-form'
import { CreateGoalForm } from '~/features/goals/presentation/create-goal-form'
import { DeleteGoalConfirmation } from '~/features/goals/presentation/delete-confirmation'
import { UpdateGoalForm } from '~/features/goals/presentation/update-goal-form'
import { dateFormatter } from '~/features/shared/date-formatter'
import { Button } from '~/ui/Button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/ui/card'
import { Header } from '~/ui/Header'
import { Headline } from '~/ui/headline'
import { BaseModal } from '~/ui/modal'
import { Panel, PanelInfo } from '~/ui/panel'

export function meta() {
  return [{ title: 'Metas' }, { name: 'Metas', content: 'Financial Goals' }]
}

export { action, loader }

export default function Goals() {
  const { goals, accounts } = useLoaderData<typeof loader>()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isContributionOpen, setIsContributionOpen] = useState(false)

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  return (
    <div className="flow">
      <Header
        title="Objetivos/Metas"
        subtitle="Acompanhe o progresso de suas metas"
        data-background="blank"
        data-direction="reverse"
      />

      <Panel
        title="Meta com maior progresso"
        icon={<TrendingUp className="size-[1em]" />}
      >
        <PanelInfo>
          <h4>Nome da meta</h4>
          <p>Descrição</p>
          <span>Progresso</span>
        </PanelInfo>
        <PanelInfo>
          <h4>{`Salvos totais (todas as metas)`}</h4>
          <p>R$ 1.250</p>
        </PanelInfo>
      </Panel>

      <div className="flow mt-xl">
        <Headline title="Metas">
          <Button
            onClick={() => setIsCreateOpen(true)}
            data-button-variant="link"
            className="text-dark-glare"
          >
            <Plus />
            <span>Adicionar nova meta</span>
          </Button>
        </Headline>
        <BaseModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
          <CreateGoalForm onExit={() => setIsCreateOpen(false)} />
        </BaseModal>
        <div className="grid">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader className="flow">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center justify-center overflow-hidden w-[3ch] h-[3ch] rounded-[50%] p-[1.2em] bg-light text-primary">
                      <Landmark className="size-[1em]" />
                    </span>
                    <span className="flex items-center justify-center w-[3ch] h-[3ch] rounded-[50%] p-[1.2em] bg-light text-primary">
                      {`${goal.progress.toFixed(0)}%`}
                    </span>
                  </div>
                  <CardTitle className="font-display font-medium">
                    {goal.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flow">
                  <CardDescription className="flex flex-col gap-3xs">
                    {goal.description ?? null}
                    {goal.projectedCompletionDate && (
                      <span className="text-step--2">
                        {`Projeção de conclusão: ${dateFormatter.format(goal.projectedCompletionDate)}`}
                      </span>
                    )}
                  </CardDescription>
                  <CardAction className="flex justify-between items-center">
                    <Button
                      onClick={() => {
                        setSelectedGoal(goal)
                        setIsContributionOpen(true)
                      }}
                      className="text-step--2"
                    >
                      Fazer Aporte
                      <BanknoteArrowUp />
                    </Button>
                    <BaseModal
                      isOpen={isContributionOpen}
                      onClose={() => setIsContributionOpen(false)}
                    >
                      <ContributionForm
                        goal={selectedGoal}
                        accounts={accounts}
                        onExit={() => setIsContributionOpen(false)}
                      />
                    </BaseModal>

                    <div className="flex gap-2xs">
                      <Button
                        onClick={() => {
                          setSelectedGoal(goal)
                          setIsUpdateOpen(true)
                        }}
                        data-button-variant="link"
                      >
                        <SquarePen />
                      </Button>
                      <BaseModal
                        isOpen={isUpdateOpen}
                        onClose={() => setIsUpdateOpen(false)}
                      >
                        <UpdateGoalForm
                          goal={selectedGoal ?? null}
                          onExit={() => setIsUpdateOpen(false)}
                        />
                      </BaseModal>

                      <Button
                        onClick={() => {
                          setSelectedGoal(goal)
                          setIsConfirmationOpen(true)
                        }}
                        data-button-variant="link"
                      >
                        <Trash />
                      </Button>
                      <DeleteGoalConfirmation
                        isOpen={isConfirmationOpen}
                        onCancel={() => setIsConfirmationOpen(false)}
                        item={selectedGoal}
                        message="Tem certeza que quer deletar essa meta?"
                      />
                    </div>
                  </CardAction>
                </CardContent>
              </Card>
            ))
          ) : (
            <span>Nenhuma meta encontrada</span>
          )}
        </div>
      </div>
    </div>
  )
}

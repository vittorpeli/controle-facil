import {
  BanknoteArrowUp,
  Landmark,
  Plus,
  Sparkles,
  SquarePen,
  Trash,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { useLoaderData } from 'react-router'
import type { Goal, GoalWithProgress } from '~/features/goals/core/goal'
import { action, loader } from '~/features/goals/http/api'
import { ContributionForm } from '~/features/goals/presentation/contribution-form'
import { CreateGoalForm } from '~/features/goals/presentation/create-goal-form'
import { DeleteGoalConfirmation } from '~/features/goals/presentation/delete-confirmation'
import { GoalProgressBar } from '~/features/goals/presentation/progress-bar'
import { UpdateGoalForm } from '~/features/goals/presentation/update-goal-form'
import { currencyFormatter } from '~/features/shared/currency-formatter'
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

  const goalWithHighestProgress = goals
    .filter((goal) => !goal.isCompleted)
    .reduce<GoalWithProgress | null>((highest, current) => {
      if (!highest) return current

      return current.progress > highest.progress ? current : highest
    }, null)

  const totalContributed = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0,
  )

  const orderedGoals = [...goals].sort((a, b) => {
    if (a.progress !== b.progress) return a.progress - b.progress
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

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
        {goalWithHighestProgress ? (
          <PanelInfo className="flow">
            <h4>{goalWithHighestProgress.name}</h4>
            {goalWithHighestProgress.description ? (
              <p>{goalWithHighestProgress.description}</p>
            ) : null}
            <GoalProgressBar
              value={goalWithHighestProgress.progress}
              currentAmount={goalWithHighestProgress.currentAmount}
              targetAmount={goalWithHighestProgress.targetAmount}
            />
          </PanelInfo>
        ) : (
          <PanelInfo>
            <h4>Nenhuma meta em andamento</h4>
          </PanelInfo>
        )}
        <PanelInfo>
          <Card>
            <CardHeader style={{ gap: 'var(--spacing-3xs)' }}>
              <CardTitle className="flex gap-3xs items-center">
                <span className="text-step-1 font-medium">Salvos Totais</span>
                <span className="text-step--2">Todas as metas*</span>
              </CardTitle>
              <h2>{currencyFormatter.format(totalContributed)}</h2>
            </CardHeader>

            <CardContent>
              <div className="flex gap-2xs px-s items-center">
                <span className="bg-secondary text-primary rounded-full p-2xs">
                  <Sparkles
                    className="size-[0.8em]"
                    fill="var(--color-primary)"
                  />
                </span>
                <span className="cluster text-step--1">
                  Nunca deixe de separar o dinheiro do seu futuro. Pague-se
                  primeiro!
                </span>
              </div>
            </CardContent>
          </Card>
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
            orderedGoals.map((goal) => (
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
                    <div className="flex flex-col">
                      <span className="text-step--2 cluster">
                        Valor Alvo:{' '}
                        {currencyFormatter.format(goal.targetAmount)}
                      </span>

                      {goal.currentAmount && (
                        <span className="text-step--2 cluster">
                          {`Acumulado: ${currencyFormatter.format(goal.currentAmount)}`}
                        </span>
                      )}

                      {goal.projectedCompletionDate && (
                        <span className="text-step--2">
                          {`Projeção de conclusão: ${dateFormatter.format(goal.projectedCompletionDate)}`}
                        </span>
                      )}
                    </div>
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

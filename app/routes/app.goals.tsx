import {
  BanknoteArrowUp,
  Landmark,
  Plus,
  SquarePen,
  Trash,
  TrendingUp,
} from 'lucide-react'
import { useLoaderData } from 'react-router'
import { requireAuth } from '~/features/auth/services/require-auth'
import { makeListGoalsUseCase } from '~/features/goals/application/use-cases/list-goals'
import { DrizzleContributionsRepository } from '~/features/goals/services/drizzle-contributions-repository'
import { DrizzleGoalsRepository } from '~/features/goals/services/drizzle-goals-repository'
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
import { Panel, PanelInfo } from '~/ui/panel'
import type { Route } from './+types/app.goals'

export function meta() {
  return [{ title: 'Metas' }, { name: 'Metas', content: 'Financial Goals' }]
}

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

export default function Goals() {
  const { goals } = useLoaderData<typeof loader>()

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
          <Button data-button-variant="link" className="text-dark-glare">
            <Plus />
            <span>Adicionar nova meta</span>
          </Button>
        </Headline>
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
                      {`${goal.progress}%`}
                    </span>
                  </div>
                  <CardTitle className="font-display font-medium">
                    {goal.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flow">
                  <CardDescription className="flex flex-col gap-3xs">
                    {goal.description}
                    {goal.projectedCompletionDate && (
                      <span className="text-step--2">
                        {`Projeção de conclusão: ${dateFormatter.format(goal.projectedCompletionDate)}`}
                      </span>
                    )}
                  </CardDescription>
                  <CardAction className="flex justify-between items-center">
                    <Button className="text-step--2">
                      Fazer Aporte
                      <BanknoteArrowUp />
                    </Button>
                    <div className="flex gap-2xs">
                      <Button data-button-variant="link">
                        <SquarePen />
                      </Button>
                      <Button data-button-variant="link">
                        <Trash />
                      </Button>
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

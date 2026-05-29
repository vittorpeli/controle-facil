import { ShieldCheckIcon, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '~/ui/card'
import { SavingProgress } from './saving-progress'

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function SafeToSpend({ amount }: { amount: number }) {
  return (
    <Card
      className="flow flow-space-2xl"
      style={{ '--gutter': 'var(--spacing-l)' } as React.CSSProperties}
    >
      <CardHeader>
        <div className="repel">
          <p className="uppercase text-step-1 font-bold">Livre para gastos</p>
          <ShieldCheckIcon />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flow flow-space-s">
          <span className="font-bold text-step-5">
            {formatter.format(amount)}
          </span>
          <p>Livres para você gastar ou investir ainda.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function Savings({ amount, goal }: { amount: number; goal: number }) {
  const progress = (amount / goal) * 100

  return (
    <Card
      className="flow flow-space-2xl"
      style={{ '--gutter': 'var(--spacing-l)' } as React.CSSProperties}
    >
      <CardHeader>
        <div className="repel">
          <p className="uppercase text-step-1 font-bold">Poupado no Mês</p>
          <TrendingUp />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flow flow-space-s">
          <span className="font-bold text-step-5">
            {formatter.format(amount)}
          </span>
          <SavingProgress progress={progress === Infinity ? 100 : progress} />
        </div>
      </CardContent>
    </Card>
  )
}

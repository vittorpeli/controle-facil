import {
  ArrowRight,
  BanknoteArrowUp,
  HousePlus,
  ShoppingCart,
} from 'lucide-react'
import { SafeToSpend, Savings } from '~/features/dashboard/components/balance'
import { Button } from '~/ui/Button'
import * as Chart from '~/ui/chart'
import { Header } from '~/ui/Header'
import { Headline } from '~/ui/headline'
import { Transaction } from '~/ui/Transaction'
import * as Table from '~/ui/table'

export function meta() {
  return [
    { title: 'Controle Fácil - Ínicio' },
    { name: 'Página Inicial', content: 'Main Dashboard' },
  ]
}

export default function AppIndex() {
  const chartLegend = [
    { label: 'Receita', colorClass: 'bg-dark-glare' },
    { label: 'Despesa', colorClass: 'bg-mid' },
  ]

  const upcomingBills = [
    { id: 1, title: 'Conta de Luz', date: new Date(), value: 85 },
    { id: 2, title: 'Conta de Água', date: new Date(), value: 120 },
    { id: 3, title: 'Conta de Internet', date: new Date(), value: 90 },
  ]

  const transactions = [
    {
      id: 1,
      title: 'Salário',
      date: new Date(),
      icon: <BanknoteArrowUp />,
      category: 'Receita',
      value: 5000,
    },
    {
      id: 2,
      title: 'Aluguel',
      date: new Date(),
      icon: <HousePlus />,
      category: 'Despesa',
      value: -1500,
    },
    {
      id: 3,
      title: 'Supermercado',
      date: new Date(),
      icon: <ShoppingCart />,
      category: 'Despesa',
      value: -450,
    },
  ]

  return (
    <div className="flow flow-space-2xl">
      {/* Header da página com saldo atual (soma de saldo de todas as contas ativas), depois botão para página de transações */}
      <Header title="$34.820,50" subtitle="Saldo Atual">
        <Button>
          <span>Ver Mais</span>
        </Button>
      </Header>

      {/* Cards de resumo: Livre para Gastos e Poupado no Mês */}
      <div
        className="grid"
        style={{ '--grid-placement': 'auto-fit' } as React.CSSProperties}
      >
        <SafeToSpend amount={1240.0} />
        <Savings amount={450.0} goal={700.0} />
      </div>

      {/* Gráfico de despesas e receitas do mês, e próximas contas a pagar */}
      <div
        className="grid"
        style={{ '--grid-min-item-size': '20rem' } as React.CSSProperties}
      >
        <div>
          <Headline title="Fluxo Financeiro do Mês" />
          <Chart.ChartContainer height={300}>
            <Chart.ChartLegend item={chartLegend} />
            <Chart.ChartCanvas height={300}>
              <Chart.ChartLine
                path="M0,200 C250,100 750,300 1000,150"
                color="var(--color-primary)"
                strokeWidth="3"
              />

              <Chart.ChartArea path="M0,200 C250,100 750,300 1000,150 L1000,300 L0,300 Z" />

              <Chart.ChartLine
                path="M0,250 C250,150 750,350 1000,200"
                color="var(--color-dark-glare)"
                dashed={true}
              />
            </Chart.ChartCanvas>
          </Chart.ChartContainer>
        </div>

        <div>
          <Headline title="Próximas Contas" />

          <div className="flow flow-space-3xs">
            {upcomingBills.map((bill) => (
              <Transaction
                key={bill.id}
                title={bill.title}
                date={bill.date}
                value={bill.value}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabela com as 10 transações mais recentes */}
      <div>
        <Table.Table>
          <Table.TableHeader>
            <Table.TableRow>
              <Table.TableHead>Data</Table.TableHead>
              <Table.TableHead>Descrição</Table.TableHead>
              <Table.TableHead>Categoria</Table.TableHead>
              <Table.TableHead>Valor</Table.TableHead>
            </Table.TableRow>
          </Table.TableHeader>

          <Table.TableBody>
            {transactions.map((tx) => (
              <Table.TableRow key={tx.id}>
                <Table.TableCell>
                  {tx.date.toLocaleDateString()}
                </Table.TableCell>
                <Table.TableCell>
                  <Table.TableCellIcon>{tx.icon}</Table.TableCellIcon>
                  {tx.title}
                </Table.TableCell>
                <Table.TableCell>{tx.category}</Table.TableCell>
                <Table.TableCell>
                  {tx.value.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Table.TableCell>
              </Table.TableRow>
            ))}
          </Table.TableBody>
        </Table.Table>

        <div className="cluster justify-end mt-s">
          <Button data-button-variant="link">
            <span>Ver Todas as Transações</span>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SafeToSpend, Savings } from '~/features/dashboard/components/balance'
import { loader } from '~/features/dashboard/http/api'
import { currencyFormatter } from '~/features/shared/currency-formatter'
import { dateFormatter } from '~/features/shared/date-formatter'
import * as Chart from '~/ui/chart'
import { Header } from '~/ui/Header'
import { Headline } from '~/ui/headline'
import { Transaction } from '~/ui/Transaction'
import * as Table from '~/ui/table'
import type { Route } from './+types/app._index'

export function meta() {
  return [
    { title: 'Controle Fácil - Ínicio' },
    { name: 'Página Inicial', content: 'Main Dashboard' },
  ]
}

export { loader }

export default function AppIndex({ loaderData }: Route.ComponentProps) {
  const {
    totalBalances,
    transactions,
    recurrences,
    safeToSpend,
    savedThisMonth,
    budgetGoal,
    chartData,
  } = loaderData

  const currentMonth = new Date().getMonth()
  const upcomingBills = recurrences
    .filter(
      (r) =>
        r.nextDueDate.getMonth() === currentMonth &&
        r.monthStatus === 'pending',
    )
    .slice(0, 3)

  return (
    <div className="flow flow-space-2xl">
      {/* Header da página com saldo atual (soma de saldo de todas as contas ativas), depois botão para página de transações */}
      <Header
        title={currencyFormatter.format(totalBalances)}
        subtitle="Saldo Atual"
      >
        <Link className="button" to="/app/transactions">
          <span>Ver Mais</span>
        </Link>
      </Header>

      {/* Cards de resumo: Livre para Gastos e Poupado no Mês */}
      <div
        className="grid"
        style={{ '--grid-placement': 'auto-fit' } as React.CSSProperties}
      >
        <SafeToSpend amount={safeToSpend} />
        <Savings amount={savedThisMonth} goal={budgetGoal} />
      </div>

      {/* Gráfico de despesas e receitas do mês, e próximas contas a pagar */}
      <div
        className="grid"
        style={{ '--grid-min-item-size': '20rem' } as React.CSSProperties}
      >
        <div>
          <Headline title="Fluxo Financeiro do Mês" />
          <Chart.Chart
            series={[
              {
                label: 'Receita',
                values: chartData.map((d) => d.income),
                color: 'var(--color-primary)',
                area: true,
              },
              {
                label: 'Despesa',
                values: chartData.map((d) => d.expense),
                color: 'var(--color-dark-glare)',
                dashed: true,
              },
            ]}
          />
        </div>

        <div>
          <Headline title="Próximas Contas a Pagar" />

          <div className="flow flow-space-3xs">
            {upcomingBills.length > 0 ? (
              upcomingBills.map((bill) => (
                <Transaction
                  key={bill.id}
                  title={bill.name}
                  date={bill.nextDueDate}
                  value={bill.amount}
                />
              ))
            ) : (
              <p className="text-step--1 font-mono">
                Nenhuma conta a pagar encontrada
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabela com as 10 transações mais recentes */}
      <div>
        {transactions.length > 0 ? (
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
              {transactions.slice(0, 10).map((tx) => (
                <Table.TableRow key={tx.id}>
                  <Table.TableCell>
                    {tx.date.toLocaleDateString()}
                  </Table.TableCell>
                  <Table.TableCell>
                    {/* <Table.TableCellIcon>{tx.icon}</Table.TableCellIcon> */}
                    {tx.description ?? dateFormatter.format(tx.date)}
                  </Table.TableCell>
                  <Table.TableCell>{tx.category.name}</Table.TableCell>
                  <Table.TableCell>
                    {tx.amount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </Table.TableCell>
                </Table.TableRow>
              ))}
            </Table.TableBody>
          </Table.Table>
        ) : (
          <p>Nenhuma transação encontrada</p>
        )}

        <div className="cluster justify-end mt-s">
          <Link
            className="button"
            data-button-variant="link"
            to="/app/transactions"
          >
            <span>Ver Todas as Transações</span>
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

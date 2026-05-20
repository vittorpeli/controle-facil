import { Archive, Lightbulb, Plus, SquarePen } from 'lucide-react'
import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { dateFormatter } from '~/features/shared/date-formatter'
import { CreateAccountModal } from '~/features/transactions/components/create-account-modal'
import { CreateTransactionModal } from '~/features/transactions/components/create-transaction-modal'
import { BaseModal } from '~/features/transactions/components/modal'
import { action, loader } from '~/features/transactions/services/api'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader } from '~/ui/card'
import { Header } from '~/ui/Header'
import { Headline } from '~/ui/headline'
import { Quote } from '~/ui/Quote'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/ui/table'

export function meta() {
  return [
    { title: 'Transações' },
    { name: 'Transações', content: 'Transactions Management' },
  ]
}

export { action, loader }

export default function Transactions() {
  const { accounts, transactions, categories } = useLoaderData<typeof loader>()
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  return (
    <div className="flow">
      <Header
        title="Transações"
        subtitle="Seu histórico de transações"
        data-background="blank"
        data-direction="reverse"
      />

      <Quote
        title="Uma dica!"
        description="Não concentre suas contas em apenas um banco"
        quoteIcon={<Lightbulb />}
      />

      <div className="flow flow-space-m mt-s-l">
        <Headline title="Saldo de Contas">
          <Button
            style={
              {
                '--button-y-padding': '0.5em',
                '--button-x-padding': '0.5em',
              } as React.CSSProperties
            }
            onClick={() => setIsAccountModalOpen(true)}
          >
            <Plus />
          </Button>
          <BaseModal
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
          >
            <CreateAccountModal />
          </BaseModal>
        </Headline>
        <div className="grid">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <Headline title={account.name}>
                  <div className="flex flex-row items-center gap-2xs mr-s">
                    <Button data-button-variant="link">
                      <Archive />
                    </Button>
                    <Button data-button-variant="link">
                      <SquarePen />
                    </Button>
                  </div>
                </Headline>
              </CardHeader>

              <CardContent>
                <span className="font-medium font-mono">
                  {account.balance.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </CardContent>
            </Card>
          ))}
          {accounts.length === 0 && (
            <p className="font-mono">Nenhuma conta encontrada</p>
          )}
        </div>
      </div>

      <div className="flow flow-space-m mt-s-l">
        <Headline title="Transações">
          <Button
            data-button-variant="link"
            onClick={() => setIsTransactionModalOpen(true)}
          >
            <Plus />
          </Button>
          <BaseModal
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
          >
            <CreateTransactionModal
              accounts={accounts}
              categories={categories}
            />
          </BaseModal>
        </Headline>

        {transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{dateFormatter.format(tx.date)}</TableCell>
                  <TableCell>
                    {/* <TableCellIcon>{tx.icon}</TableCellIcon> */}
                    {tx.description ?? dateFormatter.format(tx.date)}
                  </TableCell>
                  <TableCell>
                    <span className="bg-dark-glare text-light px-2xs py-3xs rounded-md">
                      {tx.category.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    {tx.amount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="font-mono">Nenhuma transação encontrada</p>
        )}

        <div />
      </div>
    </div>
  )
}

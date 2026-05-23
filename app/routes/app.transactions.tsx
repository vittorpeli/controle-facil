import { Archive, Lightbulb, Plus, SquarePen } from 'lucide-react'
import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { dateFormatter } from '~/features/shared/date-formatter'
import { ArchiveConfirmationAlert } from '~/features/transactions/components/archive-confirmation-alert'
import { CreateAccountModal } from '~/features/transactions/components/create-account-modal'
import { CreateTransactionModal } from '~/features/transactions/components/create-transaction-modal'
import { EditAccountModal } from '~/features/transactions/components/edit-account-modal'
import { TransferForm } from '~/features/transactions/components/transfer-form'
import type { Account } from '~/features/transactions/core/account'
import { action, loader } from '~/features/transactions/services/api'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader } from '~/ui/card'
import { Header } from '~/ui/Header'
import { Headline } from '~/ui/headline'
import { BaseModal } from '~/ui/modal'
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
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTrasnferModalOpen] = useState(false)

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  const { accounts, transactions, categories } = useLoaderData<typeof loader>()

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
            <CreateAccountModal onSuccess={() => setIsAccountModalOpen(false)} />
          </BaseModal>
        </Headline>
        <div className="grid">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <Headline title={account.name}>
                  <div className="flex flex-row items-center gap-2xs mr-s">
                    <Button
                      data-button-variant="link"
                      onClick={() => {
                        setSelectedAccount(account)
                        setIsAlertOpen(true)
                      }}
                    >
                      <Archive />
                    </Button>
                    <Button
                      data-button-variant="link"
                      onClick={() => {
                        setSelectedAccount(account)
                        setIsEditModalOpen(true)
                      }}
                    >
                      <SquarePen />
                    </Button>
                    <BaseModal
                      isOpen={isEditModalOpen}
                      onClose={() => setIsEditModalOpen(false)}
                    >
                      <EditAccountModal
                        account={selectedAccount}
                        onCancel={() => setIsEditModalOpen(false)}
                      />
                    </BaseModal>
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

              <ArchiveConfirmationAlert
                message="Você tem certeza que quer arquivar essa conta?"
                isOpen={isAlertOpen}
                onCancel={() => setIsAlertOpen(false)}
                account={selectedAccount}
              />
            </Card>
          ))}
          {accounts.length === 0 && (
            <p className="font-mono">Nenhuma conta encontrada</p>
          )}
        </div>
      </div>

      {accounts.length > 1 ? (
        <div>
          <Button
            onClick={() => setIsTrasnferModalOpen(true)}
            data-button-variant="link"
          >
            + Registrar transferência entre contas
          </Button>
          <BaseModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTrasnferModalOpen(false)}
          >
            <TransferForm
              accounts={accounts}
              onSuccess={() => setIsTrasnferModalOpen(false)}
            />
          </BaseModal>
        </div>
      ) : null}

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
              onSuccess={() => setIsTransactionModalOpen(false)}
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

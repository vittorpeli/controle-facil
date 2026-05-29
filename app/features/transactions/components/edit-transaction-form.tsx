import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import type { Category } from '~/features/categories/core/category'
import { Button } from '~/ui/Button'
import { Input, Label, Option, Select } from '~/ui/form'
import { CurrencyInput } from '~/ui/form/currency-input'
import type { Account } from '../core/account'
import type { Transaction } from '../core/transaction'
import { editTransactionSchema } from '../services/schemas/edit-transaction-schema'

export const EditTransactionForm = ({
  transaction,
  categories,
  accounts,
  onCancel,
}: {
  transaction: Transaction | null
  categories: Category[]
  accounts: Account[]
  onCancel: () => void
}): React.ReactNode => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(editTransactionSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: editTransactionSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  useEffect(() => {
    if (fetcher.data?.success) {
      onCancel()
    }
  }, [fetcher.data, onCancel])

  if (transaction === null || !transaction) return null

  return (
    <fetcher.Form
      className="flow"
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
    >
      <Input type="hidden" name="intent" value="edit-transaction" />

      <Input
        type="hidden"
        name={fields.transactionId.name}
        value={transaction.id}
      />

      <h4 className="cluster font-display mb-2xs font-medium">
        {transaction.description ?? 'Editar Transação'}
      </h4>
      <Input type="hidden" name="intent" value="create-transaction" />

      <div>
        <Label htmlFor={fields.amount.id}>Valor*:</Label>
        <CurrencyInput
          id={fields.amount.id}
          name={fields.amount.name}
          defaultValue={transaction.amount}
          error={fields.amount.errors}
        />
      </div>

      <div>
        <Label htmlFor={fields.date.id}>Data da transação*:</Label>
        <Input
          id={fields.date.id}
          name={fields.date.name}
          defaultValue={transaction.date.toISOString().split('T')[0]}
          type="date"
        />
        <p className="text-step--2 text-error">{fields.date.errors}</p>
      </div>

      <div className="flex flex-row items-center gap-xs">
        <Label htmlFor={fields.accountId.id}>Conta*:</Label>
        <div>
          <Select
            name={fields.accountId.name}
            id={fields.accountId.id}
            defaultValue={
              accounts.find((a) => a.id === transaction.accountId)?.name
            }
          >
            <Option value="">Selecione uma conta</Option>
            {accounts.map((account) => (
              <Option key={account.id} value={account.id}>
                {account.name}
              </Option>
            ))}
          </Select>
          <p className="text-step--2 text-error">{fields.accountId.errors}</p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-xs">
        <Label htmlFor="account-types">Categoria*:</Label>
        <div>
          <Select
            name={fields.categoryId.name}
            id={fields.categoryId.id}
            defaultValue={
              categories.find((c) => c.id === transaction.categoryId)?.name
            }
          >
            <Option value="">Selecione uma categoria</Option>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
          <p className="text-step--2 text-error">{fields.categoryId.errors}</p>
        </div>
      </div>

      <div>
        <Label htmlFor={fields.description.id}>{`Descrição (opcional)`}:</Label>
        <Input
          id={fields.description.id}
          name={fields.description.name}
          defaultValue={transaction.description ?? ''}
          type="text"
        />
        <p className="text-step--2 text-error">{fields.description.errors}</p>
      </div>

      <div className="flex mt-l gap-xs justify-end">
        <Button type="button" onClick={onCancel} data-button-variant="link">
          Cancelar
        </Button>
        <Button type="submit" disabled={fetcher.state !== 'idle'}>
          {fetcher.state !== 'idle' ? 'Atualizando...' : 'Confirmar'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

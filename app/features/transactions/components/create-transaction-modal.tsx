import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useFetcher } from 'react-router'
import type { Category } from '~/features/categories/core/category'
import { Button } from '~/ui/Button'
import { Input, Label, Option, Select } from '~/ui/form'
import { CurrencyInput } from '~/ui/form/currency-input'
import type { Account } from '../core/account'
import { createTransactionSchema } from '../services/schemas/create-transaction-schema'

const transactionTypes = [
  { id: 1, value: 'income', label: 'Receita' },
  { id: 2, value: 'expense', label: 'Despesa' },
] satisfies {
  id: number
  value: 'income' | 'expense'
  label: string
}[]

export const CreateTransactionModal = ({
  accounts,
  categories,
}: {
  accounts: Account[]
  categories: Category[]
}): React.ReactNode => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(createTransactionSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createTransactionSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  return (
    <fetcher.Form
      className="flow"
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
    >
      <h4 className="cluster font-display mb-2xs font-medium">
        Cadastre uma nova transação
      </h4>
      <Input type="hidden" name="intent" value="create-transaction" />

      <div>
        <Label htmlFor={fields.amount.id}>Valor*:</Label>
        <CurrencyInput
          id={fields.amount.id}
          name={fields.amount.name}
          defaultValue={fields.amount.initialValue}
          error={fields.amount.errors}
        />
      </div>

      <div>
        <Label htmlFor={fields.date.id}>Data da transação*:</Label>
        <Input id={fields.date.id} name={fields.date.name} type="date" />
        <p className="text-step--2 text-error">{fields.date.errors}</p>
      </div>

      <div className="flex flex-row items-center gap-xs">
        <Label htmlFor={fields.accountId.id}>Conta*:</Label>
        <div>
          <Select name={fields.accountId.name} id={fields.accountId.id}>
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
        <Label htmlFor={fields.type.id}>Tipo*:</Label>
        <div>
          <Select name={fields.type.name} id={fields.type.id}>
            {transactionTypes.map((type) => (
              <Option key={type.id} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
          <p className="text-step--2 text-error">{fields.type.errors}</p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-xs">
        <Label htmlFor="account-types">Categoria*:</Label>
        <div>
          <Select name={fields.categoryId.name} id={fields.categoryId.id}>
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
          type="text"
        />
        <p className="text-step--2 text-error">{fields.description.errors}</p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={fetcher.state !== 'idle'}>
          {fetcher.state !== 'idle' ? 'Adicionando...' : 'Adicionar Transação'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

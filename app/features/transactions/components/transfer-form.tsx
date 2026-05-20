import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useFetcher } from 'react-router'
import { Button } from '~/ui/Button'
import { Input, Label, Option, Select } from '~/ui/form'
import type { Account } from '../core/account'
import { createTransferSchema } from '../services/schemas/create-transfer-schema'

export const TransferForm = ({
  accounts,
}: {
  accounts: Account[]
}): React.ReactNode => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(createTransferSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createTransferSchema,
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
      <Input type="hidden" name="intent" value="create-transfer" />
      <div className="flex flex-row items-center gap-xs">
        <Label htmlFor={fields.fromAccountId.id}>Origem*:</Label>
        <div>
          <Select name={fields.fromAccountId.name} id={fields.fromAccountId.id}>
            <Option value="">Selecione uma conta</Option>
            {accounts.map((account) => (
              <Option key={account.id} value={account.id}>
                {account.name}
              </Option>
            ))}
          </Select>
          <p className="text-step--2 text-error">
            {fields.fromAccountId.errors}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-xs">
        <Label htmlFor={fields.toAccountId.id}>Destino*:</Label>
        <div>
          <Select name={fields.toAccountId.name} id={fields.toAccountId.id}>
            <Option value="">Selecione uma conta</Option>
            {accounts.map((account) => (
              <Option key={account.id} value={account.id}>
                {account.name}
              </Option>
            ))}
          </Select>
          <p className="text-step--2 text-error">{fields.toAccountId.errors}</p>
        </div>
      </div>

      <div>
        <Label htmlFor={fields.amount.id}>Valor*:</Label>
        <Input id={fields.amount.id} name={fields.amount.name} type="number" />
        <p className="text-error text-step--2">{fields.amount.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.date.id}>Data*:</Label>
        <Input
          id={fields.date.id}
          name={fields.date.name}
          type="date"
          defaultValue={fields.date.defaultValue}
        />
        <p className="text-step--2 text-error">{fields.date.errors}</p>
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
          {fetcher.state !== 'idle'
            ? 'Registrando transferência...'
            : 'Registrar'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

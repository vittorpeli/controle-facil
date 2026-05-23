import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useFetcher } from 'react-router'
import type { AccountType } from '~/lib/db/schema'
import { Button } from '~/ui/Button'
import { Input, Label, Option, Select } from '~/ui/form'
import type { Account } from '../core/account'
import { editAccountSchema } from '../services/schemas/edit-account-schema'

const typeOptions: AccountType[] = [
  'cash',
  'checking',
  'credit_card',
  'investment',
  'savings',
  'other',
]

const types = [
  { value: typeOptions[0], label: 'Dinheiro' },
  { value: typeOptions[1], label: 'Corrente' },
  { value: typeOptions[2], label: 'Cartão de Crédito' },
  { value: typeOptions[3], label: 'Investimento' },
  { value: typeOptions[4], label: 'Poupança' },
  { value: typeOptions[5], label: 'Outro' },
]

export const EditAccountModal = ({
  account,
  onCancel,
}: {
  account: Account | null
  onCancel: () => void
}): React.ReactNode => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(editAccountSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: editAccountSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  if (account === null) return null

  return (
    <fetcher.Form
      className="flow"
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
    >
      <Input type="hidden" name="intent" value="edit-account" />

      <Input type="hidden" name={fields.accountId.name} value={account.id} />

      <div>
        <Label htmlFor={fields.name.id}>Nome*</Label>
        <Input
          id={fields.name.id}
          name={fields.name.name}
          defaultValue={account.name}
        />
        <p className="text-error text-step--2">{fields.name.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.institution.id}>Instituição Bancária</Label>
        <Input
          id={fields.institution.id}
          name={fields.institution.name}
          defaultValue={account.institution ?? ''}
        />
        <p className="text-step--2 text-error">{fields.institution.errors}</p>
      </div>

      <div className="flex flex-row items-center gap-xs">
        <Label htmlFor="account-types">Tipo* :</Label>
        <div>
          <Select
            name={fields.type.name}
            id="account-types"
            defaultValue={account.type}
          >
            {types.map((type) => (
              <Option
                key={type.value}
                value={type.value}
                className="capitalize"
              >
                {type.label}
              </Option>
            ))}
          </Select>
          <p className="text-step--2 text-error">{fields.type.errors}</p>
        </div>
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

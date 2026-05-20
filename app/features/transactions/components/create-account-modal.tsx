import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useFetcher } from 'react-router'
import type { AccountType } from '~/lib/db/schema'
import { Button } from '~/ui/Button'
import { Input, Label, Option, Select } from '~/ui/form'
import { createAccountSchema } from '../services/schemas/create-account-schema'

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

export const CreateAccountModal = (): React.ReactNode => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(createAccountSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createAccountSchema,
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
        Adicione uma nova conta bancária
      </h4>
      <Input type="hidden" name="intent" value="create-account" />

      <div>
        <Label htmlFor={fields.name.id}>Nome da conta</Label>
        <Input id={fields.name.id} name={fields.name.name} type="text" />
        <p className="text-error text-step--2">{fields.name.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.institution.id}>Instituição Bancária</Label>
        <Input
          id={fields.institution.id}
          name={fields.institution.name}
          type="text"
        />
        <p className="text-step--2 text-error">{fields.institution.errors}</p>
      </div>

      <div className="flex flex-row items-center gap-xs">
        <Label htmlFor="account-types">Tipo de Conta:</Label>
        <div>
          <Select name={fields.type.name} id="account-types">
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

      <div className="flex justify-end">
        <Button type="submit" disabled={fetcher.state !== 'idle'}>
          Criar Conta
        </Button>
      </div>
    </fetcher.Form>
  )
}

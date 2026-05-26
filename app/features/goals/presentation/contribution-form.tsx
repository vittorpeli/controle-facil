import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import type { Account } from '~/features/transactions/core/account'
import { Button } from '~/ui/Button'
import { Input, Label, Option, Select } from '~/ui/form'
import { CurrencyInput } from '~/ui/form/currency-input'
import type { Goal } from '../core/goal'
import { createContributionSchema } from '../http/schema/create-contribution-schema'

export const ContributionForm = ({
  goal,
  accounts,
  onExit,
}: {
  goal: Goal | null
  accounts: Account[]
  onExit: () => void
}): React.ReactNode => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(createContributionSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createContributionSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  useEffect(() => {
    if (fetcher.data?.success) {
      onExit()
    }
  }, [fetcher.data, onExit])

  if (goal === null || !goal) return null

  return (
    <fetcher.Form
      className="flow"
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
    >
      <h4 className="cluster font-display mb-2xs font-medium">
        Cadastre seu aporte
      </h4>
      <input type="hidden" name="intent" value="create-contribution" />
      <input type="hidden" name={fields.goalId.name} value={goal.id} />

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
        <Label htmlFor={fields.date.id}>Data do aporte*:</Label>
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

      <div>
        <Label htmlFor={fields.description.id}>{`Descrição (opcional)`}:</Label>
        <Input
          id={fields.description.id}
          name={fields.description.name}
          type="text"
        />
        <p className="text-step--2 text-error">{fields.description.errors}</p>
      </div>

      <div className="flex flex-row items-center gap-2xs justify-end">
        <Button
          type="button"
          onClick={onExit}
          data-button-variant="link"
          disabled={fetcher.state !== 'idle'}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={fetcher.state !== 'idle'}>
          {fetcher.state !== 'idle'
            ? 'Adicionando novo aporte...'
            : 'Adicionar aporte'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

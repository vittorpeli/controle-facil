import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect } from 'react'
import { useFetcher, useRevalidator } from 'react-router'
import { Button } from '~/ui/Button'
import { Label } from '~/ui/form'
import { CurrencyInput } from '~/ui/form/currency-input'
import type { Budget } from '../core/budget'
import { editBudgetSchema } from '../http/schemas/edit-budget-schema'

export const EditBudgetForm = ({
  budget,
  onCancel,
  name,
}: {
  budget?: Budget | null
  onCancel: () => void
  name: string
}) => {
  const fetcher = useFetcher()
  const revalidator = useRevalidator()

  const [form, fields] = useForm({
    constraint: getZodConstraint(editBudgetSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: editBudgetSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  useEffect(() => {
    if (fetcher.data?.success) {
      onCancel()
      revalidator.revalidate()
    }
  }, [fetcher.data, onCancel, revalidator])

  if (!budget) return null

  return (
    <fetcher.Form
      className="flow"
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
    >
      <input type="hidden" name="intent" value="edit-budget" />
      <input type="hidden" name={fields.budgetId.name} value={budget.id} />

      <h4>{name}</h4>

      <div>
        <Label htmlFor={fields.limitAmount.id}>Limite:</Label>
        <CurrencyInput
          id={fields.limitAmount.id}
          name={fields.limitAmount.name}
          defaultValue={budget?.limitAmount ?? fields.limitAmount.initialValue}
          error={fields.limitAmount.errors}
        />
      </div>

      <div className="flex justify-end gap-2xs">
        <Button type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          data-button-variant="secondary"
          disabled={fetcher.state !== 'idle'}
        >
          {fetcher.state !== 'idle' ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

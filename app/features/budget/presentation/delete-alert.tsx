import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect } from 'react'
import { useFetcher, useRevalidator } from 'react-router'
import { Button } from '~/ui/Button'
import type { BudgetProgress } from '../core/budget'
import { deleteBudgetSchema } from '../http/schemas/delete-budget-schema'

interface ConfirmationAlertProps {
  message?: string
  onCancel: () => void
  isOpen: boolean
  budget?: BudgetProgress | null
}

export function DeleteBudgetAlert({
  message,
  onCancel,
  isOpen,
  budget,
}: ConfirmationAlertProps) {
  const fetcher = useFetcher()
  const revalidator = useRevalidator()

  const [form, fields] = useForm({
    constraint: getZodConstraint(deleteBudgetSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: deleteBudgetSchema,
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

  if (!isOpen || !budget) return null

  return (
    <div className="fixed inset-0 bg-primary/40 flex items-center justify-center z-50">
      <div className="bg-light rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        {message && (
          <p className="text-dark-glare mb-6 text-step--2">{message}</p>
        )}
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} className="mt-4 text-step--2">
            Cancelar
          </Button>
          <fetcher.Form method="post" id={form.id} onSubmit={form.onSubmit}>
            <input type="hidden" name="intent" value="delete-budget" />

            <input
              type="hidden"
              name={fields.budgetId.name}
              value={budget.id}
            />

            <Button
              type="submit"
              className="bg-error hover:bg-red-700 transition"
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state !== 'idle' ? 'Excluindo Orçamento...' : 'Sim'}
            </Button>
          </fetcher.Form>
        </div>
        <p className="text-error text-step--2">{fields.budgetId.errors}</p>
      </div>
    </div>
  )
}

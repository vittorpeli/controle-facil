import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import type { ConfirmationAlertProps } from '~/features/shared/confirmation-alert-props'
import { Button } from '~/ui/Button'
import type { Goal } from '../core/goal'
import { deleteGoalSchema } from '../http/schema/delete-goal-schema'

export const DeleteGoalConfirmation = ({
  message,
  onCancel,
  isOpen,
  item: goal,
}: ConfirmationAlertProps<Goal>) => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(deleteGoalSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: deleteGoalSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  useEffect(() => {
    if (fetcher.data?.success) {
      onCancel()
    }
  }, [fetcher.data, onCancel])

  if (!isOpen || !goal) return null

  return (
    <div className="fixed inset-0 bg-primary/40 flex items-center justify-center z-50">
      <div className="bg-light rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <h4 className="font-display">{goal.name}</h4>
        {message && (
          <p className="text-dark-glare mb-6 text-step--2">{message}</p>
        )}
        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} className="mt-4 text-step--2">
            Cancelar
          </Button>
          <fetcher.Form method="post" id={form.id} onSubmit={form.onSubmit}>
            <input type="hidden" name="intent" value="delete-goal" />

            <input type="hidden" name={fields.goalId.name} value={goal.id} />

            <Button
              type="submit"
              className="bg-error hover:bg-red-700 transition"
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state !== 'idle' ? 'Deletando...' : 'Sim'}
            </Button>
          </fetcher.Form>
        </div>
        <p className="text-error text-step--2">{fields.goalId.errors}</p>
      </div>
    </div>
  )
}

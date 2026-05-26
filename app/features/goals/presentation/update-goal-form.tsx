import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import { Button } from '~/ui/Button'
import { Input, Label } from '~/ui/form'
import { CurrencyInput } from '~/ui/form/currency-input'
import type { Goal } from '../core/goal'
import { updateGoalSchema } from '../http/schema/update-goal-schema'

export const UpdateGoalForm = ({
  goal,
  onExit,
}: {
  goal: Goal | null
  onExit: () => void
}) => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(updateGoalSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: updateGoalSchema,
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
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
      className="flow"
    >
      <h4 className="cluster font-display mb-2xs font-medium">{goal.name}</h4>
      <input type="hidden" name="intent" value="update-goal" />
      <input type="hidden" name={fields.goalId.name} value={goal.id} />

      <div>
        <Label htmlFor={fields.name.id}>Nome*:</Label>
        <Input
          id={fields.name.id}
          name={fields.name.name}
          defaultValue={goal.name}
        />
        <p className="text-step--2 text-error">{fields.name.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.targetAmount.id}>Valor Alvo*:</Label>
        <CurrencyInput
          id={fields.targetAmount.id}
          name={fields.targetAmount.name}
          defaultValue={goal.targetAmount}
          error={fields.targetAmount.errors}
        />
      </div>

      <div>
        <Label htmlFor={fields.deadline.id}>
          {`Data de Conclusão (desejada)*`}:
        </Label>
        <Input
          id={fields.deadline.id}
          name={fields.deadline.name}
          defaultValue={goal.deadline.toISOString().split('T')[0]}
          type="date"
        />
        <p className="text-step--2 text-error">{fields.deadline.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.description.id}>{`Descrição (opcional)`}:</Label>
        <Input
          id={fields.description.id}
          name={fields.description.name}
          defaultValue={goal.description ?? fields.description.value}
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
          {fetcher.state !== 'idle' ? 'Atualizando...' : 'Atualizar Meta'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

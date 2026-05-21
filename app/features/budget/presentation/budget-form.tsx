import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useFetcher } from 'react-router'
import type { Category } from '~/features/categories/core/category'
import { Button } from '~/ui/Button'
import { Label, Option, Select } from '~/ui/form'
import { CurrencyInput } from '~/ui/form/currency-input'
import { createBudgetSchema } from '../http/schemas/create-budget-schema'

export const BudgetForm = ({ categories }: { categories: Category[] }) => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(createBudgetSchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createBudgetSchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return (
    <fetcher.Form
      className="flow"
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
    >
      <input type="hidden" name="intent" value="create-budget" />
      <input type="hidden" name={fields.month.name} value={currentMonth} />
      <input type="hidden" name={fields.year.name} value={currentYear} />

      <div>
        <Label htmlFor={fields.categoryId.id}>Selecione a categoria</Label>
        <Select name={fields.categoryId.name} id={fields.categoryId.id}>
          <Option value="">Selecione uma Categoria</Option>
          {categories.map((c) => (
            <Option key={c.id} value={c.id}>
              {c.name}
            </Option>
          ))}
        </Select>
        <p className="text-step--2 text-error">{fields.categoryId.errors}</p>
      </div>

      <div>
        <Label htmlFor={fields.limitAmount.id}>Limite:</Label>
        <CurrencyInput
          id={fields.limitAmount.id}
          name={fields.limitAmount.name}
          defaultValue={fields.limitAmount.initialValue}
          error={fields.limitAmount.errors}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          data-button-variant="secondary"
          disabled={fetcher.state !== 'idle'}
        >
          {fetcher.state !== 'idle' ? 'Criando' : 'Criar Orçamento'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

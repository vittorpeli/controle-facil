import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import { Button } from '~/ui/Button'
import { Input, Label } from '~/ui/form'
import type { Category } from '../core/category'
import { editCategorySchema } from '../http/schema/edit-category-schema'

export const EditCategoryForm = ({
  category,
  onCancel,
}: {
  category?: Category | null
  onCancel: () => void
}) => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(editCategorySchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: editCategorySchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  useEffect(() => {
    if (fetcher.data?.success) {
      onCancel()
    }
  }, [fetcher.data, onCancel])

  if (!category) return null

  return (
    <fetcher.Form
      className="flow"
      id={form.id}
      onSubmit={form.onSubmit}
      method="post"
    >
      <input type="hidden" name="intent" value="edit-category" />

      <input type="hidden" name={fields.categoryId.name} value={category.id} />

      <h4>{category.name}</h4>

      <div>
        <Label htmlFor={fields.name.id}>Nome</Label>
        <Input id={fields.name.id} name={fields.name.name} />
        <p className="text-error text-step--2">{fields.name.errors}</p>
      </div>

      <div className="flex justify-end gap-2xs">
        <Button
          data-button-variant="link"
          type="button"
          disabled={fetcher.state !== 'idle'}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={fetcher.state !== 'idle'}>
          {fetcher.state !== 'idle' ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

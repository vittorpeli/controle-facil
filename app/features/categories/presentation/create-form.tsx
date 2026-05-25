import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { useEffect, useState } from 'react'
import { useFetcher } from 'react-router'
import { Button } from '~/ui/Button'
import { Checkbox, Input, Label, Option, Select } from '~/ui/form'
import type { Category } from '../core/category'
import { createCategorySchema } from '../http/schema/create-category-schema'

export const CreateCategoryForm = ({
  categories,
  onCancel,
}: {
  categories: Category[]
  onCancel: () => void
}) => {
  const fetcher = useFetcher()

  const [form, fields] = useForm({
    constraint: getZodConstraint(createCategorySchema),
    lastResult: fetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createCategorySchema,
      })
    },
    shouldValidate: 'onBlur',
  })

  useEffect(() => {
    if (fetcher.data?.success) {
      onCancel()
    }
  }, [fetcher.data, onCancel])

  const [isParentCategory, setIsParentCategory] = useState(false)

  return (
    <fetcher.Form
      className="flow"
      id={form.id}
      onSubmit={form.onSubmit}
      method="post"
    >
      <input type="hidden" name="intent" value="create-category" />

      <div>
        <Label htmlFor={fields.name.id}>Nome</Label>
        <Input id={fields.name.id} name={fields.name.name} />
        <p className="text-error text-step--2">{fields.name.errors}</p>
      </div>

      <div>
        <Label htmlFor="parentOrNot">Categoria Pai?:</Label>
        <Checkbox
          id="parentOrNot"
          name="parentOrNot"
          checked={isParentCategory}
          onCheckedChange={(checked) => setIsParentCategory(Boolean(checked))}
        />
      </div>

      <div>
        <div className="flex flex-row items-center gap-xs">
          <Label htmlFor="account-types">Categoria Pai:</Label>
          <div>
            <Select
              name={fields.parentId.name}
              id={fields.parentId.id}
              disabled={isParentCategory}
            >
              {categories
                .filter((c) => c.parentId === null)
                .map((c) => (
                  <Option key={c.id} value={c.id} className="capitalize">
                    {c.name}
                  </Option>
                ))}
            </Select>
            <p className="text-step--2 text-error">{fields.parentId.errors}</p>
          </div>
        </div>
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
          {fetcher.state !== 'idle' ? 'Criando...' : 'Criar'}
        </Button>
      </div>
    </fetcher.Form>
  )
}

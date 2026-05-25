import type { UUID } from 'node:crypto'
import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFetcher, useLoaderData } from 'react-router'
import { requireAuth } from '~/features/auth/services/require-auth'
import { makeCreateCategoryUseCase } from '~/features/categories/application/use-cases/create-category'
import { makeListCategoriesUseCase } from '~/features/categories/application/use-cases/list-categories'
import { createCategorySchema } from '~/features/categories/http/schema/create-category-schema'
import { CategoryAccordion } from '~/features/categories/presentation/category-accordion'
import { DrizzleCategoriesRepository } from '~/features/categories/services/drizzle-categories-repository'
import { Button } from '~/ui/Button'
import { Checkbox, Input, Label, Option, Select } from '~/ui/form'
import { Headline } from '~/ui/headline'
import { BaseModal } from '~/ui/modal'
import type { Route } from './+types/app.categories'

export function meta() {
  return [
    { title: 'Categorias' },
    { name: 'Categorias', content: 'Budget Categories' },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)

  const categoriesRepository = new DrizzleCategoriesRepository()

  const listCategories = makeListCategoriesUseCase(categoriesRepository)

  const { categories } = await listCategories({
    userId: user.id,
    includeArchived: true,
  })

  const parentCategories = categories.filter((c) => c.parentId === null)

  return { categories, parentCategories }
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireAuth(request)
  const formData = await request.formData()

  const submission = parseWithZod(formData, {
    schema: createCategorySchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const categoriesRepository = new DrizzleCategoriesRepository()
  const createCategory = makeCreateCategoryUseCase(categoriesRepository)

  await createCategory({
    userId: user.id,
    name: submission.value.name,
    parentId: (submission.value.parentId as UUID) ?? null,
  })

  return Response.json({ success: true })
}

export default function Categories() {
  const { categories, parentCategories } = useLoaderData<typeof loader>()
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

  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [isParentCategory, setIsParentCategory] = useState(false)

  return (
    <div className="flow">
      <Headline title="Todas Categorias">
        <Button
          style={
            {
              '--button-y-padding': '0.5em',
              '--button-x-padding': '0.5em',
            } as React.CSSProperties
          }
          onClick={() => setOpenCreateModal(true)}
        >
          <Plus />
        </Button>
        <BaseModal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
        >
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
                onCheckedChange={(checked) =>
                  setIsParentCategory(Boolean(checked))
                }
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
                  <p className="text-step--2 text-error">
                    {fields.parentId.errors}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2xs">
              <Button
                data-button-variant="link"
                type="button"
                disabled={fetcher.state !== 'idle'}
                onClick={() => setOpenCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={fetcher.state !== 'idle'}>
                {fetcher.state !== 'idle' ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </fetcher.Form>
        </BaseModal>
      </Headline>

      <CategoryAccordion parents={parentCategories} categories={categories} />
    </div>
  )
}

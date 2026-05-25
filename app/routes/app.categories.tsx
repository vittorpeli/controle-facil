import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { action, loader } from '~/features/categories/http/api'
import { CategoryAccordion } from '~/features/categories/presentation/category-accordion'
import { CreateCategoryForm } from '~/features/categories/presentation/create-form'
import { Button } from '~/ui/Button'
import { Headline } from '~/ui/headline'
import { BaseModal } from '~/ui/modal'

export function meta() {
  return [
    { title: 'Categorias' },
    { name: 'Categorias', content: 'Budget Categories' },
  ]
}

export { action, loader }

export default function Categories() {
  const { categories, parentCategories } = useLoaderData<typeof loader>()

  const [openCreateModal, setOpenCreateModal] = useState(false)

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
          <CreateCategoryForm
            categories={categories}
            onCancel={() => setOpenCreateModal(false)}
          />
        </BaseModal>
      </Headline>

      <CategoryAccordion parents={parentCategories} categories={categories} />
    </div>
  )
}

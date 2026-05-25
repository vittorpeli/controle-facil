import { Archive, ChevronDown, ChevronUp, SquarePen } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '~/ui/card'
import { BaseModal } from '~/ui/modal'
import type { Category } from '../core/category'
import { EditCategoryForm } from './edit-form'

export const CategoryAccordion = ({
  parents,
  categories,
}: {
  parents: Category[]
  categories: Category[]
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [openParentEditModal, setOpenParentEditModal] = useState(false)
  const [openChildEditModal, setOpenChildEditModal] = useState(false)

  const onTitleClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index)
  }

  return (
    <div>
      {parents.map((parent, index) => {
        const isActive = index === activeIndex
        const childCategories = categories.filter(
          (c) => c.parentId === parent.id && c.isArchived === false,
        )

        return (
          <div key={parent.id} className="mb-3xs">
            <button
              type="button"
              onClick={() => onTitleClick(index)}
              className="w-full border border-neutral-200 bg-neutral-50 rounded-md flex justify-between text-dark-glare py-2xs px-2xs hover:cursor-pointer hover:brightness-110 font-bold"
            >
              <div className="flex flex-row items-center gap-2xs">
                {parent.name}
                {!parent.isDefault ? (
                  <div className="flex flex-row items-center gap-3xs">
                    <Button data-button-variant="link">
                      <Archive />
                    </Button>

                    <Button
                      data-button-variant="link"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCategory(parent)
                        setOpenParentEditModal(true)
                      }}
                    >
                      <SquarePen />
                    </Button>
                    <BaseModal
                      isOpen={openParentEditModal}
                      onClose={() => setOpenParentEditModal(false)}
                    >
                      <EditCategoryForm
                        category={selectedCategory}
                        onCancel={() => setOpenParentEditModal(false)}
                      />
                    </BaseModal>
                  </div>
                ) : null}
              </div>
              <span>{isActive ? <ChevronUp /> : <ChevronDown />}</span>
            </button>

            {isActive && (
              <div className="grid border border-neutral-200 bg-neutral-50 py-xs px-2xs rounded-b-md">
                {childCategories.length > 0 ? (
                  childCategories.map((c) => (
                    <Card key={c.id}>
                      <CardHeader>
                        <CardTitle className="font-medium">{c.name}</CardTitle>
                      </CardHeader>

                      <CardContent className="flex flex-col gap-2xs">
                        <div className="flex flex-row items-center gap-2xs">
                          <Button
                            data-button-variant="link"
                            disabled={c.isDefault}
                          >
                            <Archive />
                          </Button>

                          <Button
                            data-button-variant="link"
                            disabled={c.isDefault}
                            onClick={() => {
                              setSelectedCategory(c)
                              setOpenChildEditModal(true)
                            }}
                          >
                            <SquarePen />
                          </Button>
                          <BaseModal
                            isOpen={openChildEditModal}
                            onClose={() => setOpenChildEditModal(false)}
                          >
                            <EditCategoryForm
                              category={selectedCategory}
                              onCancel={() => setOpenChildEditModal(false)}
                            />
                          </BaseModal>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-step--1">
                    Nenhuma categoria filha encontrada.
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

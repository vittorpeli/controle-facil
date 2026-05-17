import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeCategory } from '~/tests/helpers'
import { InMemoryCategoriesRepository } from '~/tests/repositories/in-memory-categories-repository'
import { makeEditCategoryUseCase } from './edit-category'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let categoriesRepository: InMemoryCategoriesRepository
let sut: ReturnType<typeof makeEditCategoryUseCase>

describe('Archive Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = makeEditCategoryUseCase(categoriesRepository)
  })

  it('should be able to edit a category name', async () => {
    const category = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      name: 'Nova Categoria',
    })

    const { category: updatedCategory } = await sut({
      categoryId: category.id,
      userId: USER_ID,
      name: 'Novo Nome',
    })

    expect(updatedCategory.name).toBe('Novo Nome')
  })

  it('should not be able to edit a default category', async () => {
    const category = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isDefault: true,
      name: 'Categoria Padrão',
    })

    await expect(
      sut({
        categoryId: category.id,
        userId: USER_ID,
        name: 'Novo Nome',
      }),
    ).rejects.toThrow('default categories cannot be edited')
  })

  it('should not be able to edit a non-existing category', async () => {
    await expect(
      sut({
        categoryId: randomUUID() as UUID,
        userId: USER_ID,
        name: 'Groceries',
      }),
    ).rejects.toThrow('category not found')
  })

  it('should not be able to edit categories from another user', async () => {
    const category = await makeCategory(categoriesRepository, {
      userId: OTHER_USER_ID,
      isDefault: false,
    })

    await expect(
      sut({
        categoryId: category.id,
        userId: USER_ID,
        name: 'Groceries',
      }),
    ).rejects.toThrow('unauthorized')
  })

  it('should not be able to rename a category to an existing category name', async () => {
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      name: 'Food',
    })

    const categoryToEdit = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      name: 'Transport',
    })

    await expect(
      sut({
        categoryId: categoryToEdit.id,
        userId: USER_ID,
        name: 'Food',
      }),
    ).rejects.toThrow('category name already in use')
  })
})

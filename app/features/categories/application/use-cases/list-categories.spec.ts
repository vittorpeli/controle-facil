import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeCategory } from '~/tests/helpers'
import { InMemoryCategoriesRepository } from '~/tests/repositories/in-memory-categories-repository'
import { makeListCategoriesUseCase } from './list-categories'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let categoriesRepository: InMemoryCategoriesRepository
let sut: ReturnType<typeof makeListCategoriesUseCase>

describe('Archive Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = makeListCategoriesUseCase(categoriesRepository)
  })

  it('should list all categories, including archived', async () => {
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: false,
    })
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: false,
    })
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: true,
    })

    await sut({
      userId: USER_ID,
    })

    expect(categoriesRepository.items).toHaveLength(3)
  })

  it('should list only active categories', async () => {
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: false,
    })
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: false,
    })
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: true,
    })

    const { categories } = await sut({
      userId: USER_ID,
      includeArchived: false,
    })

    expect(categories).toHaveLength(2)
  })

  it('should not list categories from another user', async () => {
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: false,
    })
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: true,
    })
    await makeCategory(categoriesRepository, {
      userId: OTHER_USER_ID,
      isArchived: false,
    })

    const { categories } = await sut({
      userId: USER_ID,
    })

    expect(categories).toHaveLength(2)
  })

  it('should list global categories', async () => {
    await makeCategory(categoriesRepository, {
      userId: null,
    })
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
    })

    const { categories } = await sut({
      userId: USER_ID,
    })

    expect(categories).toHaveLength(2)
  })

  it('should not list archived global categories when includeArchived is false', async () => {
    await makeCategory(categoriesRepository, {
      userId: null,
      isArchived: true,
    })

    const result = await sut({
      userId: USER_ID,
      includeArchived: false,
    })

    expect(result.categories).toHaveLength(0)
  })

  it('should return an empty list when no categories exist', async () => {
    const result = await sut({
      userId: USER_ID,
    })

    expect(result.categories).toEqual([])
  })
})

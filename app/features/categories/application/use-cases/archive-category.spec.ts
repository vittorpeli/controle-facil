import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeCategory } from '~/tests/helpers'
import { InMemoryCategoriesRepository } from '~/tests/repositories/in-memory-categories-repository'
import { makeArchiveCategoryUseCase } from './archive-category'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let categoriesRepository: InMemoryCategoriesRepository
let sut: ReturnType<typeof makeArchiveCategoryUseCase>

describe('Archive Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = makeArchiveCategoryUseCase(categoriesRepository)
  })

  // ─── Arquivamento simples ────────────────────────────────────────────────

  it('should set isArchived to true on the category', async () => {
    const category = await makeCategory(categoriesRepository, {
      userId: USER_ID,
    })

    await sut({ categoryId: category.id, userId: USER_ID })

    const updated = await categoriesRepository.findById(category.id)
    expect(updated?.isArchived).toBe(true)
  })

  it('should not delete the category record', async () => {
    const category = await makeCategory(categoriesRepository, {
      userId: USER_ID,
    })

    await sut({ categoryId: category.id, userId: USER_ID })

    expect(categoriesRepository.items).toHaveLength(1)
  })

  it('should be idempotent — archiving an already archived category does not throw', async () => {
    const category = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: true,
    })

    await expect(
      sut({ categoryId: category.id, userId: USER_ID }),
    ).resolves.not.toThrow()
  })

  // ─── Cascata em subcategorias ────────────────────────────────────────────

  it('should archive all subcategories when archiving a parent', async () => {
    const parent = await makeCategory(categoriesRepository, { userId: USER_ID })
    const child1 = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      parentId: parent.id,
    })
    const child2 = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      parentId: parent.id,
    })

    await sut({ categoryId: parent.id, userId: USER_ID })

    const updatedChild1 = await categoriesRepository.findById(child1.id)
    const updatedChild2 = await categoriesRepository.findById(child2.id)
    expect(updatedChild1?.isArchived).toBe(true)
    expect(updatedChild2?.isArchived).toBe(true)
  })

  it('should not archive subcategories from other parents', async () => {
    const target = await makeCategory(categoriesRepository, { userId: USER_ID })
    const unrelated = await makeCategory(categoriesRepository, {
      userId: USER_ID,
    })
    const unrelatedChild = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      parentId: unrelated.id,
    })

    await sut({ categoryId: target.id, userId: USER_ID })

    const untouched = await categoriesRepository.findById(unrelatedChild.id)
    expect(untouched?.isArchived).toBe(false)
  })

  it('should skip subcategories that are already archived', async () => {
    const parent = await makeCategory(categoriesRepository, { userId: USER_ID })
    await makeCategory(categoriesRepository, {
      userId: USER_ID,
      parentId: parent.id,
      isArchived: true, // já arquivada — não deve causar erro
    })

    await expect(
      sut({ categoryId: parent.id, userId: USER_ID }),
    ).resolves.not.toThrow()
  })

  // ─── Categorias padrão ───────────────────────────────────────────────────

  it('should allow archiving a default category', async () => {
    const defaultCat = await makeCategory(categoriesRepository, {
      userId: null, // categoria padrão global
      isDefault: true,
    })

    await sut({ categoryId: defaultCat.id, userId: USER_ID })

    const updated = await categoriesRepository.findById(defaultCat.id)
    expect(updated?.isArchived).toBe(true)
  })

  it('should cascade into children of a default parent', async () => {
    const defaultParent = await makeCategory(categoriesRepository, {
      userId: null,
      isDefault: true,
    })
    const child = await makeCategory(categoriesRepository, {
      userId: null,
      isDefault: true,
      parentId: defaultParent.id,
    })

    await sut({ categoryId: defaultParent.id, userId: USER_ID })

    const updatedChild = await categoriesRepository.findById(child.id)
    expect(updatedChild?.isArchived).toBe(true)
  })

  // ─── Autorização ─────────────────────────────────────────────────────────

  it('should throw if category does not exist', async () => {
    await expect(
      sut({ categoryId: randomUUID() as UUID, userId: USER_ID }),
    ).rejects.toThrow('category not found')
  })

  it('should throw if category belongs to another user', async () => {
    const othersCategory = await makeCategory(categoriesRepository, {
      userId: OTHER_USER_ID,
      isDefault: false,
    })

    await expect(
      sut({ categoryId: othersCategory.id, userId: USER_ID }),
    ).rejects.toThrow('category not found')
  })

  it('should use the same error for non-existent and unauthorized to avoid enumeration', async () => {
    const othersCategory = await makeCategory(categoriesRepository, {
      userId: OTHER_USER_ID,
      isDefault: false,
    })

    const notFound = sut({ categoryId: randomUUID() as UUID, userId: USER_ID })
    const forbidden = sut({ categoryId: othersCategory.id, userId: USER_ID })

    await expect(notFound).rejects.toThrow('category not found')
    await expect(forbidden).rejects.toThrow('category not found')
  })
})

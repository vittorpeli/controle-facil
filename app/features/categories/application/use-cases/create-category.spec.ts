import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeCategory } from '~/tests/helpers'
import { InMemoryCategoriesRepository } from '~/tests/repositories/in-memory-categories-repository'
import { makeCreateCategoryUseCase } from './create-category'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let categoriesRepository: InMemoryCategoriesRepository
let sut: ReturnType<typeof makeCreateCategoryUseCase>

describe('Create Category Use Case', () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository()
    sut = makeCreateCategoryUseCase(categoriesRepository)
  })

  it('should create a parent category', async () => {
    const { category } = await sut({ userId: USER_ID, name: 'Lazer' })

    expect(category.id).toBeDefined()
    expect(category.name).toBe('Lazer')
    expect(category.parentId).toBeNull()
    expect(category.userId).toBe(USER_ID)
  })

  it('should persist the category', async () => {
    const { category } = await sut({ userId: USER_ID, name: 'Lazer' })
    expect(categoriesRepository.items).toHaveLength(1)
  })

  // Categoria Pai

  it('should set isDefault to false for user-created categories', async () => {
    const { category } = await sut({ userId: USER_ID, name: 'Lazer' })
    expect(category.isDefault).toBe(false)
  })

  it('should set isArchived to false on creation', async () => {
    const { category } = await sut({ userId: USER_ID, name: 'Lazer' })
    expect(category.isArchived).toBe(false)
  })

  it('should generate unique ids for each category', async () => {
    const { category: c1 } = await sut({ userId: USER_ID, name: 'Lazer' })
    const { category: c2 } = await sut({ userId: USER_ID, name: 'Saúde' })
    expect(c1.id).not.toBe(c2.id)
  })

  // Subcategoria
  it('should create a subcategory linked to a parent', async () => {
    const parent = await makeCategory(categoriesRepository, { userId: USER_ID })

    const { category } = await sut({
      userId: USER_ID,
      name: 'Cinema',
      parentId: parent.id,
    })

    expect(category.parentId).toBe(parent.id)
  })

  it('should allow creating a subcategory under a default category', async () => {
    // Categorias padrão têm userId = null mas são acessíveis a todos
    const defaultParent = await makeCategory(categoriesRepository, {
      userId: null,
      isDefault: true,
    })

    const { category } = await sut({
      userId: USER_ID,
      name: 'Minha Subcategoria',
      parentId: defaultParent.id,
    })

    expect(category.parentId).toBe(defaultParent.id)
    expect(category.isDefault).toBe(false) // filho de padrão não vira padrão
    expect(category.userId).toBe(USER_ID)
  })

  // ─── Validações ──────────────────────────────────────────────────────────

  it('should throw if name is empty', async () => {
    await expect(sut({ userId: USER_ID, name: '' })).rejects.toThrow(
      'name cannot be empty',
    )
  })

  it('should throw if name is blank (only whitespace)', async () => {
    await expect(sut({ userId: USER_ID, name: '   ' })).rejects.toThrow(
      'name cannot be empty',
    )
  })

  it('should throw if parentId does not exist', async () => {
    await expect(
      sut({ userId: USER_ID, name: 'Cinema', parentId: randomUUID() as UUID }),
    ).rejects.toThrow('parent category not found')
  })

  it('should throw if parent is itself a subcategory (max 2 levels)', async () => {
    const grandparent = await makeCategory(categoriesRepository, {
      userId: USER_ID,
    })
    const parent = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      parentId: grandparent.id, // já é subcategoria
    })

    await expect(
      sut({ userId: USER_ID, name: 'Neto', parentId: parent.id }),
    ).rejects.toThrow('subcategories cannot have children')
  })

  it('should throw if parent is archived', async () => {
    const archivedParent = await makeCategory(categoriesRepository, {
      userId: USER_ID,
      isArchived: true,
    })

    await expect(
      sut({ userId: USER_ID, name: 'Filho', parentId: archivedParent.id }),
    ).rejects.toThrow('parent category is archived')
  })

  it('should throw if parent belongs to another user', async () => {
    const othersParent = await makeCategory(categoriesRepository, {
      userId: OTHER_USER_ID,
      isDefault: false, // privada de outro usuário
    })

    await expect(
      sut({ userId: USER_ID, name: 'Filho', parentId: othersParent.id }),
    ).rejects.toThrow('parent category not found')
  })
})

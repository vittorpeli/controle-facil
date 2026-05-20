import { randomUUID, type UUID } from 'node:crypto'
import { db } from '.'
import { categories } from './schema'

type SeedCategory = {
  id: UUID
  name: string
  children?: { name: string }[]
}

const DEFAULT_CATEGORIES: SeedCategory[] = [
  {
    id: randomUUID(),
    name: 'Moradia',
    children: [
      { name: 'Aluguel' },
      { name: 'Condomínio' },
      { name: 'Água e Luz' },
      { name: 'Manutenção' },
    ],
  },
  {
    id: randomUUID(),
    name: 'Alimentação',
    children: [
      { name: 'Mercado' },
      { name: 'Restaurante' },
      { name: 'Delivery' },
    ],
  },
  {
    id: randomUUID(),
    name: 'Transporte',
    children: [
      { name: 'Combustível' },
      { name: 'Ônibus / Metrô' },
      { name: 'App de Corrida' },
      { name: 'Manutenção do Carro' },
    ],
  },
  {
    id: randomUUID(),
    name: 'Saúde',
    children: [
      { name: 'Plano de Saúde' },
      { name: 'Consultas' },
      { name: 'Farmácia' },
      { name: 'Academia' },
    ],
  },
  {
    id: randomUUID(),
    name: 'Lazer',
    children: [
      { name: 'Streaming' },
      { name: 'Viagem' },
      { name: 'Jogos' },
      { name: 'Eventos e Shows' },
    ],
  },
  {
    id: randomUUID(),
    name: 'Educação',
    children: [
      { name: 'Cursos' },
      { name: 'Livros' },
      { name: 'Escola / Faculdade' },
    ],
  },
  {
    id: randomUUID(),
    name: 'Receita',
    children: [
      { name: 'Salário' },
      { name: 'Freelance' },
      { name: 'Rendimento de Investimento' },
      { name: 'Outros' },
    ],
  },
]

export async function seedDefaultCategories() {
  console.log('🌱 Seeding default categories...')

  for (const cat of DEFAULT_CATEGORIES) {
    // Insert parent
    await db
      .insert(categories)
      .values({
        id: cat.id,
        userId: null, // null = categoria padrão global
        name: cat.name,
        parentId: null,
        isDefault: true,
        isArchived: false,
      })
      .onConflictDoNothing()

    // Insert children
    for (const child of cat.children ?? []) {
      await db
        .insert(categories)
        .values({
          id: randomUUID(),
          userId: null,
          name: child.name,
          parentId: cat.id,
          isDefault: true,
          isArchived: false,
        })
        .onConflictDoNothing()
    }
  }

  console.log('✅ Default categories seeded.')
}

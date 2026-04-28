import { db } from '.'
import { categories } from './schema'

type SeedCategory = {
  id: string
  name: string
  children?: { id: string; name: string }[]
}

const DEFAULT_CATEGORIES: SeedCategory[] = [
  {
    id: 'cat_moradia',
    name: 'Moradia',
    children: [
      { id: 'cat_aluguel', name: 'Aluguel' },
      { id: 'cat_condominio', name: 'Condomínio' },
      { id: 'cat_agua_luz', name: 'Água e Luz' },
      { id: 'cat_manutencao', name: 'Manutenção' },
    ],
  },
  {
    id: 'cat_alimentacao',
    name: 'Alimentação',
    children: [
      { id: 'cat_mercado', name: 'Mercado' },
      { id: 'cat_restaurante', name: 'Restaurante' },
      { id: 'cat_delivery', name: 'Delivery' },
    ],
  },
  {
    id: 'cat_transporte',
    name: 'Transporte',
    children: [
      { id: 'cat_combustivel', name: 'Combustível' },
      { id: 'cat_onibus_metro', name: 'Ônibus / Metrô' },
      { id: 'cat_uber', name: 'App de Corrida' },
      { id: 'cat_manut_carro', name: 'Manutenção do Carro' },
    ],
  },
  {
    id: 'cat_saude',
    name: 'Saúde',
    children: [
      { id: 'cat_plano_saude', name: 'Plano de Saúde' },
      { id: 'cat_consulta', name: 'Consultas' },
      { id: 'cat_farmacia', name: 'Farmácia' },
      { id: 'cat_academia', name: 'Academia' },
    ],
  },
  {
    id: 'cat_lazer',
    name: 'Lazer',
    children: [
      { id: 'cat_streaming', name: 'Streaming' },
      { id: 'cat_viagem', name: 'Viagem' },
      { id: 'cat_jogos', name: 'Jogos' },
      { id: 'cat_eventos', name: 'Eventos e Shows' },
    ],
  },
  {
    id: 'cat_educacao',
    name: 'Educação',
    children: [
      { id: 'cat_cursos', name: 'Cursos' },
      { id: 'cat_livros', name: 'Livros' },
      { id: 'cat_escola', name: 'Escola / Faculdade' },
    ],
  },
  {
    id: 'cat_receita',
    name: 'Receita',
    children: [
      { id: 'cat_salario', name: 'Salário' },
      { id: 'cat_freelance', name: 'Freelance' },
      { id: 'cat_investimento', name: 'Rendimento de Investimento' },
      { id: 'cat_outros_rec', name: 'Outros' },
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
          id: child.id,
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

import { randomUUID, type UUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { parseEmail } from '~/features/auth/core/email'
import type { Session } from '~/features/auth/core/session'
import type { User } from '~/features/auth/core/user'
import type { Budget } from '~/features/budget/core/budget'
import type { Category } from '~/features/categories/core/category'
import type { Goal } from '~/features/goals/core/goal'
import type { Recurrence } from '~/features/recurrences/core/recurrence'
import type { Account } from '~/features/transactions/core/account'
import type { Transaction } from '~/features/transactions/core/transaction'
import type { InMemoryAccountsRepository } from './repositories/in-memory-accounts-repository'
import type { InMemoryBudgetsRepository } from './repositories/in-memory-budgets-repository'
import type { InMemoryCategoriesRepository } from './repositories/in-memory-categories-repository'
import type { InMemoryGoalsRepository } from './repositories/in-memory-goals-repository'
import type { InMemoryRecurrencesRepository } from './repositories/in-memory-recurrences-repository'
import type { InMemorySessionsRepository } from './repositories/in-memory-sessions-repository'
import type { InMemoryTransactionsRepository } from './repositories/in-memory-transactions-repository'
import type { InMemoryUsersRepository } from './repositories/in-memory-users-repository'

export function validEmail(raw: string) {
  const result = parseEmail(raw)
  if (result.kind === 'err') throw new Error(`Invalid test email: ${raw}`)
  return result.value
}

// Cria um usuário já persistido para usar nos testes de sign-in
export async function makeUser(
  usersRepository: InMemoryUsersRepository,
  overrides: Partial<User> = {},
): Promise<User> {
  const user: User = {
    id: randomUUID() as UUID,
    name: 'John Doe',
    email: validEmail('john@example.com'),
    passwordHash: await bcrypt.hash('secret123', 1),
    createdAt: new Date(),
    ...overrides,
  }
  return usersRepository.create(user)
}

export function makeSession(
  userId: UUID,
  repo: InMemorySessionsRepository,
  overrides: Partial<Session> = {},
): Promise<Session> {
  return repo.create({
    id: randomUUID() as UUID,
    userId,
    token: randomUUID(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    createdAt: new Date(),
    ...overrides,
  })
}

export function makeAccount(
  userId: UUID,
  repo: InMemoryAccountsRepository,
  overrides: Partial<Account> = {},
): Promise<Account> {
  return repo.create({
    id: randomUUID() as UUID,
    userId,
    name: 'Conta Corrente Itaú',
    type: 'checking',
    institution: 'Itaú',
    isArchived: false,
    createdAt: new Date(),
    ...overrides,
  })
}

export function makeTransaction(
  userId: UUID,
  repo: InMemoryTransactionsRepository,
  overrides: Partial<Transaction> = {},
): Promise<Transaction> {
  return repo.create({
    id: randomUUID() as UUID,
    userId,
    accountId: randomUUID() as UUID,
    categoryId: randomUUID() as UUID,
    transferGroupId: null,
    type: 'income',
    date: new Date(2026, 3, 1),
    amount: 5000,
    createdAt: new Date(),
    description: null,
    goalId: null,
    status: 'cleared',
    ...overrides,
  })
}

export function makeGoal(
  userId: UUID,
  repo: InMemoryGoalsRepository,
  overrides: Partial<Goal> = {},
): Promise<Goal> {
  return repo.create({
    id: randomUUID() as UUID,
    userId,
    name: 'Fundo de Emergência',
    targetAmount: 10_000,
    deadline: new Date(2030, 11, 31),
    description: null,
    createdAt: new Date(),
    ...overrides,
  })
}

export function makeBudget(
  userId: UUID,
  repo: InMemoryBudgetsRepository,
  overrides: Partial<Budget> = {},
): Promise<Budget> {
  return repo.create({
    id: randomUUID() as UUID,
    userId,
    categoryId: randomUUID() as UUID,
    limitAmount: 5000,
    month: 6,
    year: 2026,
    createdAt: new Date(),
    ...overrides,
  })
}

export function makeCategory(
  repo: InMemoryCategoriesRepository,
  overrides: Partial<Category> = {},
): Promise<Category> {
  return repo.create({
    id: randomUUID() as UUID,
    userId: null,
    name: 'Alimentação',
    parentId: null,
    isDefault: false,
    isArchived: false,
    createdAt: new Date(),
    ...overrides,
  })
}

export function makeRecurrence(
  userId: UUID,
  repo: InMemoryRecurrencesRepository,
  overrides: Partial<Recurrence> = {},
): Promise<Recurrence> {
  return repo.create({
    id: randomUUID() as UUID,
    userId,
    name: 'Empréstimo Carro',
    amount: 200,
    frequency: 'monthly',
    dueDay: 5,
    accountId: randomUUID() as UUID,
    categoryId: null,
    isSubscription: false,
    createdAt: new Date(),
    ...overrides,
  })
}

import { randomUUID, type UUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { parseEmail } from '~/features/auth/core/email'
import type { Session } from '~/features/auth/core/session'
import type { User } from '~/features/auth/core/user'
import type { Account } from '~/features/transactions/core/account'
import type { InMemoryAccountsRepository } from './repositories/in-memory-accounts-repository'
import type { InMemorySessionsRepository } from './repositories/in-memory-sessions-repository'
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

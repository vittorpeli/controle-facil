import { randomUUID, type UUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { parseEmail } from '~/features/auth/core/email'
import type { User } from '~/features/auth/core/user'
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

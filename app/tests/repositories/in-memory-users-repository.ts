import type { UUID } from 'node:crypto'
import type { UsersRepository } from '~/features/auth/application/ports/users-repository'
import type { Email } from '~/features/auth/core/email'
import type { User } from '~/features/auth/core/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(user: User): Promise<User> {
    this.items.push(user)
    return user
  }

  async findById(id: UUID): Promise<User | null> {
    return this.items.find((u) => u.id === id) ?? null
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.items.find((u) => u.email === email) ?? null
  }
}

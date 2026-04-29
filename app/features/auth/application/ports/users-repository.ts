import type { UUID } from 'crypto'
import type { Email } from '../../core/email'
import type { User } from '../../core/user'

export interface UsersRepository {
  create(user: User): Promise<User>
  findById(id: UUID): Promise<User | null>
  findByEmail(email: Email): Promise<User | null>
}

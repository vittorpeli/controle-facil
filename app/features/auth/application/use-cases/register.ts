import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import type { Email } from '../../core/email'
import type { User } from '../../core/user'
import type { UsersRepository } from '../ports/users-repository'

interface RegisterUseCaseRequest {
  userName: string
  email: Email
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

type RegisterUseCase = (
  request: RegisterUseCaseRequest,
) => Promise<RegisterUseCaseResponse>

export const makeRegisterUseCase = (
  usersRepository: UsersRepository,
): RegisterUseCase => {
  return async ({ userName, email, password }) => {
    const userWithSameEmail = await usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('user already exists with that email')
    }

    const password_hash = await bcrypt.hash(password, 10)

    const user = await usersRepository.create({
      id: randomUUID(),
      name: userName,
      email,
      passwordHash: password_hash,
      createdAt: new Date(),
    })

    return {
      user,
    }
  }
}

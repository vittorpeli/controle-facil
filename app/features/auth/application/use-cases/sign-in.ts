import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import type { Email } from '../../core/email'
import type { Session } from '../../core/session'
import type { User } from '../../core/user'
import type { SessionsRepository } from '../ports/sessions-repository'
import type { UsersRepository } from '../ports/users-repository'

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface SignInUseCaseRequest {
  email: Email
  password: string
}

interface SignInUseCaseResponse {
  user: User
  session: Session
}

type SignInUseCase = (
  request: SignInUseCaseRequest,
) => Promise<SignInUseCaseResponse>

export const makeSignInUseCase = (
  usersRepository: UsersRepository,
  sessionsRepository: SessionsRepository,
): SignInUseCase => {
  return async ({ email, password }) => {
    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new Error('invalid credentials')
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatches) {
      throw new Error('invalid credentials')
    }

    const now = new Date()

    const session = await sessionsRepository.create({
      id: randomUUID(),
      userId: user.id,
      token: randomUUID(),
      expiresAt: new Date(now.getTime() + SESSION_DURATION_MS),
      createdAt: now,
    })

    return { user, session }
  }
}

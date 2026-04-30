import type { User } from '../../core/user'
import type { SessionsRepository } from '../ports/sessions-repository'
import type { UsersRepository } from '../ports/users-repository'

interface ValidateSessionUseCaseResponse {
  user: User
}

export const makeValidateSessionUseCase = (
  sessionsRepository: SessionsRepository,
  usersRepository: UsersRepository,
) => {
  return async (token: string): Promise<ValidateSessionUseCaseResponse> => {
    const session = await sessionsRepository.findByToken(token)

    if (!session) {
      throw new Error('session not found')
    }

    if (session.expiresAt < new Date()) {
      throw new Error('session expired')
    }

    const user = await usersRepository.findById(session.userId)

    if (!user) {
      throw new Error('session user not found')
    }

    return { user }
  }
}

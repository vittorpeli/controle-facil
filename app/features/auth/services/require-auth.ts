import { redirect } from 'react-router'
import { makeValidateSessionUseCase } from '../application/use-cases/validate-session'
import type { User } from '../core/user'
import { DrizzleSessionsRepository } from './drizze-sessions-repository'
import { DrizzleUsersRepository } from './drizzle-users-repository'
import { getSessionToken } from './session-cookie'

const LOGIN_PATH = '/login'

/**
 * Garante que a requisição possui uma sessão válida.
 * Use nos loaders de todas as rotas protegidas.
 *
 * @returns O `user` autenticado
 * @throws redirect para /login se a sessão for ausente, expirada ou inválida
 */
export async function requireAuth(request: Request): Promise<User> {
  const token = await getSessionToken(request)

  if (!token) {
    throw redirect(LOGIN_PATH)
  }

  const validateSession = makeValidateSessionUseCase(
    new DrizzleSessionsRepository(),
    new DrizzleUsersRepository(),
  )

  try {
    const { user } = await validateSession(token)
    return user
  } catch {
    // Cobre: session not found, session expired, session user not found
    throw redirect(LOGIN_PATH)
  }
}

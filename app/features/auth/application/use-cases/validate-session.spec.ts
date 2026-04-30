import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeSession, makeUser } from '~/tests/helpers'
import { InMemorySessionsRepository } from '~/tests/repositories/in-memory-sessions-repository'
import { InMemoryUsersRepository } from '~/tests/repositories/in-memory-users-repository'
import { makeValidateSessionUseCase } from './validate-session'

let usersRepository: InMemoryUsersRepository
let sessionsRepository: InMemorySessionsRepository
let sut: ReturnType<typeof makeValidateSessionUseCase>

describe('Validate Session Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sessionsRepository = new InMemorySessionsRepository()
    sut = makeValidateSessionUseCase(sessionsRepository, usersRepository)
  })

  it('should return the user for a valid session token', async () => {
    const user = await makeUser(usersRepository)
    const session = await makeSession(user.id, sessionsRepository)

    const { user: result } = await sut(session.token)

    expect(result.id).toBe(user.id)
    expect(result.email).toBe(user.email)
  })

  it('should throw if the token does not exist', async () => {
    await expect(sut('token-that-does-not-exist')).rejects.toThrow(
      'session not found',
    )
  })

  it('should throw if the session is expired', async () => {
    const user = await makeUser(usersRepository)
    const session = await makeSession(user.id, sessionsRepository, {
      expiresAt: new Date(Date.now() - 1000), // 1 segundo no passado
    })

    await expect(sut(session.token)).rejects.toThrow('session expired')
  })

  it('should throw if the session user no longer exists', async () => {
    // Cria sessão com um userId que não existe no repositório
    const ghostId = randomUUID() as UUID
    const session = await makeSession(ghostId, sessionsRepository)

    await expect(sut(session.token)).rejects.toThrow('session user not found')
  })
})

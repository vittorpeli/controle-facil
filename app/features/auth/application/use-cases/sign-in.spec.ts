import { beforeEach, describe, expect, it } from 'vitest'
import { makeUser, validEmail } from '~/tests/helpers'
import { InMemorySessionsRepository } from '~/tests/repositories/in-memory-sessions-repository'
import { InMemoryUsersRepository } from '~/tests/repositories/in-memory-users-repository'
import { makeSignInUseCase } from './sign-in'

let usersRepository: InMemoryUsersRepository
let sessionsRepository: InMemorySessionsRepository
let sut: ReturnType<typeof makeSignInUseCase>

describe('Sign In Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sessionsRepository = new InMemorySessionsRepository()
    sut = makeSignInUseCase(usersRepository, sessionsRepository)
  })

  it('should return the user and a new session on valid credentials', async () => {
    await makeUser(usersRepository)

    const { user, session } = await sut({
      email: validEmail('john@example.com'),
      password: 'secret123',
    })

    expect(user.email).toBe('john@example.com')
    expect(session.userId).toBe(user.id)
    expect(session.token).toBeDefined()
    expect(session.expiresAt).toBeInstanceOf(Date)
  })

  it('should persist the session in the repository', async () => {
    await makeUser(usersRepository)

    const { session } = await sut({
      email: validEmail('john@example.com'),
      password: 'secret123',
    })

    expect(sessionsRepository.items).toHaveLength(1)
    expect(sessionsRepository.items[0].token).toBe(session.token)
  })

  it('should set session expiry to 7 days from now', async () => {
    await makeUser(usersRepository)

    const before = new Date()
    const { session } = await sut({
      email: validEmail('john@example.com'),
      password: 'secret123',
    })
    const after = new Date()

    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000

    // expiresAt deve estar entre (before + 7d) e (after + 7d) com margem de 1s
    expect(session.expiresAt.getTime()).toBeGreaterThanOrEqual(
      before.getTime() + sevenDaysMs - 1000,
    )
    expect(session.expiresAt.getTime()).toBeLessThanOrEqual(
      after.getTime() + sevenDaysMs + 1000,
    )
  })

  it('should generate a unique token for each session', async () => {
    await makeUser(usersRepository)

    const { session: s1 } = await sut({
      email: validEmail('john@example.com'),
      password: 'secret123',
    })
    const { session: s2 } = await sut({
      email: validEmail('john@example.com'),
      password: 'secret123',
    })

    expect(s1.token).not.toBe(s2.token)
  })

  it('should throw if no user is found with the given email', async () => {
    await expect(
      sut({
        email: validEmail('ghost@example.com'),
        password: 'secret123',
      }),
    ).rejects.toThrow('invalid credentials')
  })

  it('should throw if the password is wrong', async () => {
    await makeUser(usersRepository)

    await expect(
      sut({
        email: validEmail('john@example.com'),
        password: 'wrong-password',
      }),
    ).rejects.toThrow('invalid credentials')
  })

  it('should throw the same error for wrong email and wrong password (no user enumeration)', async () => {
    await makeUser(usersRepository)

    const wrongEmail = sut({
      email: validEmail('ghost@example.com'),
      password: 'secret123',
    })

    const wrongPassword = sut({
      email: validEmail('john@example.com'),
      password: 'wrong-password',
    })

    await expect(wrongEmail).rejects.toThrow('invalid credentials')
    await expect(wrongPassword).rejects.toThrow('invalid credentials')
  })
})

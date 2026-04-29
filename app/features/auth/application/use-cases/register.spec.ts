import bcrypt from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '~/tests/repositories/in-memory-users-repository'
import { parseEmail } from '../../core/email'
import { makeRegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: ReturnType<typeof makeRegisterUseCase>

function validEmail(raw: string) {
  const result = parseEmail(raw)
  if (result.kind === 'err') throw new Error(`Invalid test email: ${raw}`)
  return result.value
}

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = makeRegisterUseCase(usersRepository)
  })

  it('should register a new user and return it', async () => {
    const { user } = await sut({
      userName: 'John Doe',
      email: validEmail('johnexample@.com'),
      password: 'secret123',
    })

    expect(user.id).toBeDefined()
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('johnexample@.com')
    expect(user.createdAt).toBeInstanceOf(Date)
  })

  it('should persist the user in the repository', async () => {
    await sut({
      userName: 'John Doe',
      email: validEmail('john@example.com'),
      password: 'secret123',
    })

    expect(usersRepository.items).toHaveLength(1)
    expect(usersRepository.items[0].email).toBe('john@example.com')
  })

  it('should store the password as a bcrypt hash, never plain text', async () => {
    const plainPassword = 'secret123'

    await sut({
      userName: 'John Doe',
      email: validEmail('john@example.com'),
      password: plainPassword,
    })

    const { passwordHash } = usersRepository.items[0]

    expect(passwordHash).not.toBe(plainPassword)
    await expect(bcrypt.compare(plainPassword, passwordHash)).resolves.toBe(
      true,
    )
  })

  it('should throw if a user with the same email already exists', async () => {
    const email = validEmail('john@example.com')

    await sut({
      userName: 'John Doe',
      email,
      password: 'secret123',
    })

    await expect(
      sut({
        userName: 'Jane Doe',
        email,
        password: 'other-password',
      }),
    ).rejects.toThrow('user already exists with that email')
  })

  it('should generate a unique id for each user', async () => {
    const { user: user1 } = await sut({
      userName: 'User One',
      email: validEmail('one@example.com'),
      password: 'pass1',
    })

    const { user: user2 } = await sut({
      userName: 'User Two',
      email: validEmail('two@example.com'),
      password: 'pass2',
    })

    expect(user1.id).not.toBe(user2.id)
  })
})

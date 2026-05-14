import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGoalsRepository } from '~/tests/repositories/in-memory-goals-repository'
import { makeCreateGoalUseCase } from './create-goal'

const USER_ID = randomUUID() as UUID

let goalsRepository: InMemoryGoalsRepository
let sut: ReturnType<typeof makeCreateGoalUseCase>

describe('Create Goal Use Case', () => {
  beforeEach(() => {
    goalsRepository = new InMemoryGoalsRepository()
    sut = makeCreateGoalUseCase(goalsRepository)
  })

  it('should be able to create a new goal', async () => {
    const { goal } = await sut({
      userId: USER_ID,
      name: 'Fundo de Emergência',
      targetAmount: 10000,
      deadline: new Date('2026-12-31'),
      description:
        'Montar um fundo de emergência para cobrir despesas inesperadas',
    })

    expect(goal.id).toBeDefined()
    expect(goal.name).toBe('Fundo de Emergência')
    expect(goal.targetAmount).toBe(10000)
    expect(goal.deadline.toISOString().split('T')[0]).toBe('2026-12-31')
    expect(goal.description).toBe(
      'Montar um fundo de emergência para cobrir despesas inesperadas',
    )
    expect(goal.userId).toBe(USER_ID)
  })

  it('should persist the goal in the repository', async () => {
    await sut({
      userId: USER_ID,
      name: 'Fundo de Emergência',
      targetAmount: 10000,
      deadline: new Date('2026-12-31'),
      description:
        'Montar um fundo de emergência para cobrir despesas inesperadas',
    })

    expect(goalsRepository.items).toHaveLength(1)
  })

  it('should generate a unique id for each goal', async () => {
    const { goal: g1 } = await sut({
      userId: USER_ID,
      name: 'Meta 1',
      targetAmount: 1000,
      deadline: new Date('2026-12-31'),
      description: null,
    })
    const { goal: g2 } = await sut({
      userId: USER_ID,
      name: 'Meta 2',
      targetAmount: 2000,
      deadline: new Date('2026-12-31'),
      description: null,
    })

    expect(g1.id).not.toBe(g2.id)
  })

  it('should allow creating goals without description', async () => {
    const { goal } = await sut({
      userId: USER_ID,
      name: 'Viagem',
      targetAmount: 5000,
      deadline: new Date('2026-12-31'),
    })

    expect(goal.description).toBeNull()
  })

  it('should not create goal with deadline in the past', async () => {
    await expect(
      sut({
        userId: USER_ID,
        name: 'Meta atrasada',
        targetAmount: 1000,
        deadline: new Date(2020, 0, 1), // 1 de janeiro de 2020
      }),
    ).rejects.toThrow('Deadline must be a future date')
  })

  it('should set createdAt to the current date', async () => {
    const before = new Date()
    const { goal } = await sut({
      userId: USER_ID,
      name: 'Fundo de Emergência',
      targetAmount: 10000,
      deadline: new Date('2026-12-31'),
      description:
        'Montar um fundo de emergência para cobrir despesas inesperadas',
    })
    const after = new Date()

    expect(goal.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(goal.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
  })
})

import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeGoal } from '~/tests/helpers'
import { InMemoryGoalsRepository } from '~/tests/repositories/in-memory-goals-repository'
import { makeUpdateGoalUseCase } from './update-goal'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let goalsRepository: InMemoryGoalsRepository
let sut: ReturnType<typeof makeUpdateGoalUseCase>

describe('Update Goal Use Case', () => {
  beforeEach(() => {
    goalsRepository = new InMemoryGoalsRepository()
    sut = makeUpdateGoalUseCase(goalsRepository)
  })

  it('should allow partial updates — untouched fields remain unchanged', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    const { goal: updatedGoal } = await sut({
      id: goal.id,
      userId: USER_ID,
      targetAmount: 20_000,
    })

    expect(updatedGoal.name).toBe(goal.name)
    expect(updatedGoal.targetAmount).toBe(20_000)
    expect(updatedGoal.deadline).toEqual(goal.deadline)
    expect(updatedGoal.description).toBe(goal.description)
  })

  it('should throw if goal does not exist', async () => {
    await expect(
      sut({
        id: randomUUID() as UUID,
        userId: USER_ID,
        name: 'Novo Nome',
      }),
    ).rejects.toThrow('Goal not found')
  })

  it('should throw if goal belongs to another user', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    await expect(
      sut({
        id: goal.id,
        userId: OTHER_USER_ID,
        name: 'Novo Nome',
      }),
    ).rejects.toThrow('Unauthorized')
  })
})

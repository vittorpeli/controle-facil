import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeGoal } from '~/tests/helpers'
import { InMemoryGoalsRepository } from '~/tests/repositories/in-memory-goals-repository'
import { makeDeleteGoalUseCase } from './delete-goal'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let goalsRepository: InMemoryGoalsRepository
let sut: ReturnType<typeof makeDeleteGoalUseCase>

describe('Delete Goal Use Case', () => {
  beforeEach(() => {
    goalsRepository = new InMemoryGoalsRepository()
    sut = makeDeleteGoalUseCase(goalsRepository)
  })

  it('should delete a goal', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    await sut({
      id: goal.id,
      userId: USER_ID,
    })

    expect(goalsRepository.items).toHaveLength(0)
  })

  it('should throw if goal does not exist', async () => {
    await expect(
      sut({
        id: randomUUID() as UUID,
        userId: USER_ID,
      }),
    ).rejects.toThrow('Goal not found')
  })

  it('should throw if goal belongs to another user', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    await expect(
      sut({
        id: goal.id,
        userId: OTHER_USER_ID,
      }),
    ).rejects.toThrow('Unauthorized')
  })
})

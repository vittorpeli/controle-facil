import { randomUUID, type UUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeGoal } from '~/tests/helpers'
import { InMemoryContributionsRepository } from '~/tests/repositories/in-memory-contributions-repository'
import { InMemoryGoalsRepository } from '~/tests/repositories/in-memory-goals-repository'
import { makeGetGoalUseCase } from './get-goal'

const USER_ID = randomUUID() as UUID
const OTHER_USER_ID = randomUUID() as UUID

let goalsRepository: InMemoryGoalsRepository
let contributionsRepository: InMemoryContributionsRepository
let sut: ReturnType<typeof makeGetGoalUseCase>

describe('Get Goal Use Case', () => {
  beforeEach(() => {
    goalsRepository = new InMemoryGoalsRepository()
    contributionsRepository = new InMemoryContributionsRepository()
    sut = makeGetGoalUseCase(goalsRepository, contributionsRepository)
  })

  // ─── Happy path ─────────────────────────────────────────────────────────

  it('should return the goal with progress data', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.id).toBe(goal.id)
    expect(result.name).toBe(goal.name)
    expect(result.currentAmount).toBeDefined()
    expect(result.progress).toBeDefined()
    expect(result.isCompleted).toBeDefined()
  })

  it('should return currentAmount as 0 when there are no contributions', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.currentAmount).toBe(0)
  })

  it('should return currentAmount as the sum of all contributions', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    contributionsRepository.items.push(
      { goalId: goal.id, amount: 1_000, date: new Date(2025, 0, 1) },
      { goalId: goal.id, amount: 2_500, date: new Date(2025, 1, 1) },
    )

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.currentAmount).toBe(3_500)
  })

  it('should calculate progress as percentage of targetAmount', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository, {
      targetAmount: 10_000,
    })

    contributionsRepository.items.push({
      goalId: goal.id,
      amount: 2_500,
      date: new Date(2025, 0, 1),
    })

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.progress).toBe(25)
  })

  it('should return progress above 100 when currentAmount exceeds targetAmount', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository, {
      targetAmount: 1_000,
    })

    contributionsRepository.items.push({
      goalId: goal.id,
      amount: 1_500,
      date: new Date(2025, 0, 1),
    })

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.progress).toBeGreaterThan(100)
    expect(result.isCompleted).toBe(true)
  })

  it('should mark isCompleted as false when currentAmount < targetAmount', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository, {
      targetAmount: 10_000,
    })

    contributionsRepository.items.push({
      goalId: goal.id,
      amount: 5_000,
      date: new Date(2025, 0, 1),
    })

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.isCompleted).toBe(false)
  })

  it('should mark isCompleted as true when currentAmount equals targetAmount', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository, {
      targetAmount: 5_000,
    })

    contributionsRepository.items.push({
      goalId: goal.id,
      amount: 5_000,
      date: new Date(2025, 0, 1),
    })

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.isCompleted).toBe(true)
  })

  // ─── Projeção de conclusão ───────────────────────────────────────────────

  it('should return projectedCompletion as null when there are no contributions', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.projectedCompletionDate).toBeNull()
  })

  it('should return projectedCompletion as null when goal is already completed', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository, {
      targetAmount: 1_000,
    })

    contributionsRepository.items.push({
      goalId: goal.id,
      amount: 1_000,
      date: new Date(2025, 0, 1),
    })

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.projectedCompletionDate).toBeNull()
  })

  it('should return a future date as projectedCompletionDate based on monthly average', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository, {
      targetAmount: 12_000,
    })

    // 2 aportes de R$1.000 em meses distintos → média mensal de R$1.000
    contributionsRepository.items.push(
      { goalId: goal.id, amount: 1_000, date: new Date(2025, 0, 1) },
      { goalId: goal.id, amount: 1_000, date: new Date(2025, 1, 1) },
    )

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    // currentAmount = 2.000, faltam 10.000 → ~10 meses a partir de agora
    const projectedCompletionDate = result.projectedCompletionDate

    expect(projectedCompletionDate).toBeInstanceOf(Date)
    expect(projectedCompletionDate?.getTime()).toBeGreaterThan(Date.now())
  })

  it('should not include contributions from other goals in the calculation', async () => {
    const goal = await makeGoal(USER_ID, goalsRepository)
    const otherGoal = await makeGoal(USER_ID, goalsRepository, {
      name: 'Outra Meta',
    })

    contributionsRepository.items.push(
      { goalId: goal.id, amount: 1_000, date: new Date(2025, 0, 1) },
      { goalId: otherGoal.id, amount: 9_000, date: new Date(2025, 0, 1) },
    )

    const { goal: result } = await sut({ goalId: goal.id, userId: USER_ID })

    expect(result.currentAmount).toBe(1_000)
  })

  // ─── Autorização ─────────────────────────────────────────────────────────

  it('should throw if goal does not exist', async () => {
    await expect(
      sut({ goalId: randomUUID() as UUID, userId: USER_ID }),
    ).rejects.toThrow('Goal not found')
  })

  it('should throw if goal belongs to another user', async () => {
    const goal = await makeGoal(OTHER_USER_ID, goalsRepository)

    await expect(sut({ goalId: goal.id, userId: USER_ID })).rejects.toThrow(
      'Unauthorized',
    )
  })
})

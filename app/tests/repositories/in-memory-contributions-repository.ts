import type { UUID } from 'node:crypto'
import type { ContributionsRepository } from '~/features/goals/application/ports/contributions-repository'
import type {
  Contribution,
  ContributionStats,
} from '~/features/goals/core/contribution'

export class InMemoryContributionsRepository
  implements ContributionsRepository
{
  public items: Contribution[] = []

  async getStatsByGoalId(goalId: UUID): Promise<ContributionStats> {
    const contributions = this.items.filter((c) => c.goalId === goalId)

    if (contributions.length === 0)
      return { totalContributed: 0, monthlyAverage: 0 }

    const total = contributions.reduce((sum, c) => sum + c.amount, 0)

    const months = new Set(
      contributions.map(
        (c) =>
          `${c.date.getFullYear()} - ${String(c.date.getMonth() + 1).padStart(2, '0')}`,
      ),
    )

    const monthlyAverage = total / months.size

    return { totalContributed: total, monthlyAverage }
  }
}

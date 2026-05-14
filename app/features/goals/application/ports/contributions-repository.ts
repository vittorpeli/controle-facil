import type { UUID } from 'node:crypto'
import type { ContributionStats } from '../../core/contribution'

export interface ContributionsRepository {
  getStatsByGoalId(goalId: UUID): Promise<ContributionStats>
}

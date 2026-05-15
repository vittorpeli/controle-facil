import type { UUID } from 'node:crypto'
import { and, eq, ne, sql } from 'drizzle-orm'
import { db } from '~/lib/db'
import { transactions } from '~/lib/db/schema'
import type { ContributionsRepository } from '../application/ports/contributions-repository'
import type { ContributionStats } from '../core/contribution'

export class DrizzleContributionsRepository implements ContributionsRepository {
  async getStatsByGoalId(goalId: UUID): Promise<ContributionStats> {
    const result = await db
      .select({
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`.as(
          'total',
        ),
        distinctMonths:
          sql<number>`COUNT(DISTINCT strftime('%Y-%m', ${transactions.date}))`.as(
            'distinctMonths',
          ),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.goalId, goalId),
          eq(transactions.type, 'income'),
          ne(transactions.status, 'cleared'),
        ),
      )
      .get()

    if (!result || result.total === 0) {
      return { totalContributed: 0, monthlyAverage: 0 }
    }

    const monthlyAverage =
      result.distinctMonths > 0 ? result.total / result.distinctMonths : 0

    return {
      totalContributed: result.total,
      monthlyAverage,
    }
  }
}

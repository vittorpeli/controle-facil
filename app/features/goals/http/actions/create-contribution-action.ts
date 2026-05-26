import type { UUID } from 'node:crypto'
import { parseWithZod } from '@conform-to/zod/v4'
import { DrizzleAccountsRepository } from '~/features/transactions/services/drizzle-accounts-repository'
import { DrizzleTransactionsRepository } from '~/features/transactions/services/drizzle-transactions-repository'
import { makeCreateContributionUseCase } from '../../application/use-cases/create-contributions'
import { DrizzleGoalsRepository } from '../../services/drizzle-goals-repository'
import { createContributionSchema } from '../schema/create-contribution-schema'

export async function createContributionAction(
  formData: FormData,
  userId: UUID,
) {
  const submission = parseWithZod(formData, {
    schema: createContributionSchema,
  })

  if (submission.status !== 'success') return submission.reply()

  const goalsRepository = new DrizzleGoalsRepository()
  const accountsRepository = new DrizzleAccountsRepository()
  const transactionsRepository = new DrizzleTransactionsRepository()
  const createContribution = makeCreateContributionUseCase(
    goalsRepository,
    accountsRepository,
    transactionsRepository,
  )

  const { transaction } = await createContribution({
    userId,
    goalId: submission.value.goalId as UUID,
    accountId: submission.value.accountId as UUID,
    amount: submission.value.amount,
    date: submission.value.date,
    description: submission.value.description,
  })

  return Response.json({ success: true, transactionId: transaction.id })
}

import { requireAuth } from '~/features/auth/services/require-auth'
import { makeGetBudgetProgressUseCase } from '~/features/budget/application/use-cases/get-budget-progress'
import { DrizzleBudgetsRepository } from '~/features/budget/services/drizzle-budgets-repository'
import { makeListRecurrencesUseCase } from '~/features/recurrences/application/use-cases/list-recurrences'
import { DrizzleOccurrencesRepository } from '~/features/recurrences/services/drizzle-occurrences-repository'
import { DrizzleRecurrencesRepository } from '~/features/recurrences/services/drizzle-recurrences-repository'
import { makeListAccountsUseCase } from '~/features/transactions/application/use-cases/list-accounts'
import { makeListTransactionsUseCase } from '~/features/transactions/application/use-cases/list-transactions'
import { DrizzleAccountsRepository } from '~/features/transactions/services/drizzle-accounts-repository'
import { DrizzleTransactionsRepository } from '~/features/transactions/services/drizzle-transactions-repository'
import type { Route } from '../../../routes/+types/app._index'

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAuth(request)

  const thisMonth = new Date().getMonth() + 1
  const thisYear = new Date().getFullYear()

  const transactionsRepository = new DrizzleTransactionsRepository()
  const accountsRepository = new DrizzleAccountsRepository()
  const recurrencesRepository = new DrizzleRecurrencesRepository()
  const occurrencesRepository = new DrizzleOccurrencesRepository()
  const budgetsRepository = new DrizzleBudgetsRepository()

  const listAccounts = makeListAccountsUseCase(
    accountsRepository,
    transactionsRepository,
  )
  const listTransactions = makeListTransactionsUseCase(transactionsRepository)
  const listRecurrences = makeListRecurrencesUseCase(
    recurrencesRepository,
    occurrencesRepository,
  )
  const getBudgetProgress = makeGetBudgetProgressUseCase(
    budgetsRepository,
    transactionsRepository,
  )

  const [
    { accounts },
    { transactions },
    { totals: monthTotals },
    { recurrencesWithStatus: recurrences },
    { budgetProgresses },
  ] = await Promise.all([
    listAccounts({ userId: user.id }),
    listTransactions({ userId: user.id }),
    listTransactions({ userId: user.id, month: thisMonth, year: thisYear }),
    listRecurrences({ userId: user.id, listFilter: 'recurrence' }),
    getBudgetProgress({ userId: user.id, month: thisMonth, year: thisYear }),
  ])

  const totalBalances = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  )
  const pendingRecurrencesTotal = recurrences
    .filter((r) => r.monthStatus === 'pending')
    .reduce((sum, r) => sum + r.amount, 0)

  const safeToSpend = totalBalances - pendingRecurrencesTotal
  const savedThisMonth = monthTotals.balance
  const budgetGoal = budgetProgresses.reduce((sum, b) => sum + b.limitAmount, 0)
  const income = monthTotals.income
  const expense = monthTotals.expense

  const chartData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - index))

    const month = date.getMonth()
    const year = date.getFullYear()

    const monthTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date)

      return txDate.getMonth() === month && txDate.getFullYear() === year
    })

    const income = monthTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)
    const expense = monthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)

    return {
      label: date.toLocaleDateString('pt-BR', {
        month: 'short',
      }),
      income,
      expense,
    }
  })

  return {
    totalBalances,
    transactions,
    recurrences,
    safeToSpend,
    savedThisMonth,
    budgetGoal,
    income,
    expense,
    chartData,
  }
}

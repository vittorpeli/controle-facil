import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'

// Users

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// Sessions

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: text('expires_at').notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    index('sessions_token_idx').on(t.token),
  ],
)

// Accounts
export const accountTypeEnum = [
  'checking',
  'savings',
  'credit_card',
  'investment',
  'cash',
  'other',
] as const
export type AccountType = (typeof accountTypeEnum)[number]

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type', { enum: accountTypeEnum }).notNull(),
  institution: text('institution'),
  isArchived: integer('is_archived', { mode: 'boolean' })
    .notNull()
    .default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// Categories

export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    parentId: text('parent_id'),
    isDefault: integer('is_default', { mode: 'boolean' })
      .notNull()
      .default(false),
    isArchived: integer('is_archived', { mode: 'boolean' })
      .notNull()
      .default(false),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    index('categories_user_id_idx').on(t.userId),
    index('categories_parent_id_idx').on(t.parentId),
  ],
)

// Goals
export const goals = sqliteTable(
  'goals',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    targetAmount: real('target_amount').notNull(),
    deadline: text('deadline'),
    description: text('description'),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [index('goals_user_id_idx').on(t.userId)],
)

// Transactions

export const transactionTypeEnum = ['income', 'expense', 'transfer'] as const
export type TransactionType = (typeof transactionTypeEnum)[number]

export const transactionStatusEnum = [
  'pending',
  'cleared',
  'cancelled',
] as const
export type TransactionStatus = (typeof transactionStatusEnum)[number]

export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: text('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'restrict' }),
    type: text('type', { enum: transactionTypeEnum }).notNull(),
    amount: real('amount').notNull(),
    date: text('date').notNull(),
    categoryId: text('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    description: text('description'),
    goalId: text('goal_id').references(() => goals.id, {
      onDelete: 'set null',
    }),
    status: text('status', { enum: transactionStatusEnum })
      .notNull()
      .default('cleared'),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    index('transactions_user_id_idx').on(t.userId),
    index('transactions_account_id_idx').on(t.accountId),
    index('transactions_category_id_idx').on(t.categoryId),
    index('transactions_date_idx').on(t.date),
  ],
)

// Recurrences

export const frequencyEnum = [
  'daily',
  'weekly',
  'biweekly',
  'monthly',
  'quarterly',
  'yearly',
] as const
export type Frequency = (typeof frequencyEnum)[number]

export const recurrences = sqliteTable(
  'recurrences',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    amount: real('amount').notNull(),
    frequency: text('frequency', { enum: frequencyEnum }).notNull(),
    dueDay: integer('due_day').notNull(), // 1–31
    accountId: text('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'restrict' }),
    categoryId: text('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    isSubscription: integer('is_subscription', { mode: 'boolean' })
      .notNull()
      .default(false),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [index('recurrences_user_id_idx').on(t.userId)],
)

// Recurrence Occurrences

export const occurrenceStatusEnum = ['pending', 'paid', 'skipped'] as const
export type OccurrenceStatus = (typeof occurrenceStatusEnum)[number]

export const recurrenceOccurrences = sqliteTable(
  'recurrence_occurrences',
  {
    id: text('id').primaryKey(),
    recurrenceId: text('recurrence_id')
      .notNull()
      .references(() => recurrences.id, { onDelete: 'cascade' }),
    dueDate: text('due_date').notNull(), // ISO date string
    status: text('status', { enum: occurrenceStatusEnum })
      .notNull()
      .default('pending'),
    transactionId: text('transaction_id').references(() => transactions.id, {
      onDelete: 'set null',
    }),
  },
  (t) => [
    index('recurrence_occurrences_recurrence_id_idx').on(t.recurrenceId),
    index('recurrence_occurrences_due_date_idx').on(t.dueDate),
  ],
)

// Budgets

export const budgets = sqliteTable(
  'budgets',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    month: integer('month').notNull(), // 1–12
    year: integer('year').notNull(),
    limitAmount: real('limit_amount').notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    index('budgets_user_id_idx').on(t.userId),
    index('budgets_category_month_year_idx').on(t.categoryId, t.month, t.year),
  ],
)

// Notifications

export const notificationTypeEnum = [
  'recurrence_due',
  'budget_exceeded',
  'goal_reached',
  'goal_deadline',
] as const
export type NotificationType = (typeof notificationTypeEnum)[number]

export const notifications = sqliteTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type', { enum: notificationTypeEnum }).notNull(),
    referenceId: text('reference_id'), // FK to the triggering record
    referenceType: text('reference_type'), // e.g. "recurrence", "budget", "goal"
    isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (t) => [
    index('notifications_user_id_idx').on(t.userId),
    index('notifications_is_read_idx').on(t.isRead),
  ],
)

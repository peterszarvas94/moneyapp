import { InferModel, relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// users
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  clerkId: text('clerk_id').notNull()
})

export type User = InferModel<typeof users, 'select'>
export type NewUser = InferModel<typeof users, 'insert'>

export const userRelations = relations(users, ({ many }) => ({
  accountAdmins: many(accountAdmins),
  accountViewers: many(accountViewers),
}))

// accounts
export const accounts = sqliteTable('accounts', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  currency: text('currency').notNull(),
})

export type Account = InferModel<typeof accounts, 'select'>
export type NewAccount = InferModel<typeof accounts, 'insert'>
export type UpdateAccount = {
  id?: number,
  name?: string,
  description?: string | null,
  currency?: string,
}

export const accountRelations = relations(accounts, ({ many }) => ({
  accountAdmins: many(accountAdmins),
  accountViewers: many(accountViewers),
  events: many(events),
}))

// account admins
export const accountAdmins = sqliteTable('account_admins', {
  adminId: integer('admin_id').notNull().references(() => users.id),
  accountId: integer('account_id').notNull().references(() => accounts.id),
}, (t) => ({
  pk: primaryKey(t.adminId, t.accountId)
}))

export type AccountAdmin = InferModel<typeof accountAdmins, 'select'>
export type NewAccountAdmin = InferModel<typeof accountAdmins, 'insert'>

export const accountAdminsRelations = relations(accountAdmins, ({ one }) => ({
  account: one(accounts, {
    fields: [accountAdmins.accountId],
    references: [accounts.id],
  }),
  admin: one(users, {
    fields: [accountAdmins.adminId],
    references: [users.id],
  }),
}))

// account viewers
export const accountViewers = sqliteTable('account_viewers', {
  viewerId: integer('viewer_id').notNull().references(() => users.id),
  accountId: integer('account_id').notNull().references(() => accounts.id),
}, (t) => ({
  pk: primaryKey(t.viewerId, t.accountId)
}))

export type AccountViewer = InferModel<typeof accountViewers, 'select'>
export type NewAccountViewer = InferModel<typeof accountViewers, 'insert'>

export const accountViewersRelations = relations(accountViewers, ({ one }) => ({
  account: one(accounts, {
    fields: [accountViewers.accountId],
    references: [accounts.id],
  }),
  viewer: one(users, {
    fields: [accountViewers.viewerId],
    references: [users.id],
  }),
}))

// event
export const events = sqliteTable('event', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  income: integer('amount').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  accountId: integer('account_id').notNull().references(() => accounts.id),
})

export type Event = InferModel<typeof events, 'select'>
export type NewEvent = InferModel<typeof events, 'insert'>

export const eventRelations = relations(events, ({ one, many }) => ({
  account: one(accounts, {
    fields: [events.accountId],
    references: [accounts.id],
  }),
  savings: many(savings),
}))

// savings
export const savings = sqliteTable('savings', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().notNull(),
  description: text('description'),
  amount: integer('amount').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  eventId: integer('event_id').notNull().references(() => events.id),
})

export type Saving = InferModel<typeof savings, 'select'>
export type NewSaving = InferModel<typeof savings, 'insert'>

export const savingRelations = relations(savings, ({ one }) => ({
  event: one(events, {
    fields: [savings.eventId],
    references: [events.id],
  }),
}))

import { InferModel, relations } from 'drizzle-orm';
import { int, datetime, primaryKey, text, mysqlTable } from 'drizzle-orm/mysql-core';

export const dummy = mysqlTable('dummy', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name').notNull(),
})

// users
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  clerkId: text('clerk_id').notNull(),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type User = InferModel<typeof users, 'select'>
export type NewUser = InferModel<typeof users, 'insert'>

export const userRelations = relations(users, ({ many }) => ({
  accountAdmins: many(accountAdmins),
  accountViewers: many(accountViewers),
}))

// accounts
export const accounts = mysqlTable('accounts', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name').notNull(),
  description: text('description'),
  currency: text('currency').notNull(),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type Account = InferModel<typeof accounts, 'select'>
export type NewAccount = InferModel<typeof accounts, 'insert'>

export const accountRelations = relations(accounts, ({ many }) => ({
  accountAdmins: many(accountAdmins),
  accountViewers: many(accountViewers),
  events: many(events),
/*   payments: many(payments), */
}))

// account admins
export const accountAdmins = mysqlTable('account_admins', {
  adminId: int('admin_id').notNull(),
  accountId: int('account_id').notNull(),
  createdAt: datetime('created_at').notNull(),
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
export const accountViewers = mysqlTable('account_viewers', {
  viewerId: int('viewer_id').notNull(),
  accountId: int('account_id').notNull(),
  createdAt: datetime('created_at').notNull(),
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
export const events = mysqlTable('events', {
  id: int('id').primaryKey().autoincrement(),
  name: text('name').notNull(),
  description: text('description'),
  income: int('income').notNull(),
  saving: int('saving').notNull(),
  accountId: int('account_id').notNull(),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type Event = InferModel<typeof events, 'select'>
export type NewEvent = InferModel<typeof events, 'insert'>

export const eventRelations = relations(events, ({ one, /*many*/ }) => ({
  account: one(accounts, {
    fields: [events.accountId],
    references: [accounts.id],
  }),
/*   payments: many(payments), */
}))

// payment
// export const payments = mysqlTable('payments', {
//   id: int('id').primaryKey(),
//   eventId: int('event_id').notNull().references(() => events.id),
//   accountId: int('account_id').notNull().references(() => accounts.id),
  // TODO:
  // - rework app to use account ID from db instead of route
  // - eg. you navigate /dashboard/payments/:id and it searches for accoutId, the verifies if you have access to it
  // - also do this for events
  // - this means, rework router folders yet again...
//   createdAt: text('created_at').notNull(),
//   updatedAt: text('updated_at').notNull(),
// })
//
// export type Payment = InferModel<typeof payments, 'select'>
// export type NewPayment = InferModel<typeof payments, 'insert'>
//
// export const paymentRelations = relations(payments, ({ one }) => ({
//   event: one(events, {
//     fields: [payments.eventId],
//     references: [events.id],
//   }),
//   account: one(accounts, {
//     fields: [payments.accountId],
//     references: [accounts.id],
//   }),
// }))

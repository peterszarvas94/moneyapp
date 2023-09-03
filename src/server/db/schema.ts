import { InferModel, relations } from 'drizzle-orm';
import { int, datetime, text, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

// users
export const users = mysqlTable('users', {
  id: varchar('id', { length: 21 }).primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  clerkId: text('clerk_id').notNull(),
  payeeId: text('payee_id'),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type User = InferModel<typeof users, 'select'>
export type NewUser = InferModel<typeof users, 'insert'>

export const userRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
}))

// accounts
export const accounts = mysqlTable('accounts', {
  id: varchar('id', { length: 21 }).primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  currency: text('currency').notNull(),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type Account = InferModel<typeof accounts, 'select'>
export type NewAccount = InferModel<typeof accounts, 'insert'>

export const accountRelations = relations(accounts, ({ many }) => ({
  memberships: many(memberships),
  events: many(events),
  payments: many(payments),
  payees: many(payees),
}))

// memberships
export const memberships = mysqlTable('memberships', {
  id: varchar('id', { length: 21 }).primaryKey().notNull(),
  userId: varchar('user_id', { length: 21 }).notNull(),
  accountId: varchar('account_id', { length: 21 }).notNull(),
  payeeId: varchar('payee_id', { length: 21 }),
  access: text('access', { enum: ['admin', 'viewer'] }).notNull(),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type Membership = InferModel<typeof memberships, 'select'>
export type NewMembership = InferModel<typeof memberships, 'insert'>

export const membershipRelations = relations(memberships, ({ one }) => ({
  account: one(accounts, {
    fields: [memberships.accountId],
    references: [accounts.id],
  }),
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  payee: one(payees, {
    fields: [memberships.payeeId],
    references: [payees.id],
  }),
}))

// event
export const events = mysqlTable('events', {
  id: varchar('id', { length: 21 }).primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  income: int('income').notNull(),
  saving: int('saving').notNull(),
  delivery: datetime('delivery').notNull(),
  accountId: varchar('account_id', { length: 21 }).notNull(),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type Event = InferModel<typeof events, 'select'>
export type NewEvent = InferModel<typeof events, 'insert'>

export const eventRelations = relations(events, ({ one, many }) => ({
  account: one(accounts, {
    fields: [events.accountId],
    references: [accounts.id],
  }),
  payments: many(payments),
}))

// payment
export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 21 }).primaryKey().notNull(),
  factor: int('factor').notNull(),
  extra: int('extra').notNull(),
  eventId: varchar('event_id', { length: 21 }).notNull(),
  accountId: varchar('account_id', { length: 21 }).notNull(),
  payeeId: varchar('payee_id', { length: 21 }).notNull(),
  //TODO: add transactionId and calculate
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type Payment = InferModel<typeof payments, 'select'>
export type NewPayment = InferModel<typeof payments, 'insert'>

export const paymentRelations = relations(payments, ({ one }) => ({
  event: one(events, {
    fields: [payments.eventId],
    references: [events.id],
  }),
  account: one(accounts, {
    fields: [payments.accountId],
    references: [accounts.id],
  }),
  payee: one(payees, {
    fields: [payments.payeeId],
    references: [payees.id],
  }),
}))

// payee
export const payees = mysqlTable('payees', {
  id: varchar('id', { length: 21 }).primaryKey().notNull(),
  name: text('name').notNull(),
  accountId: varchar('account_id', { length: 21 }).notNull(),
  membershipId: varchar('membership_id', { length: 21 }),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at').notNull(),
})

export type Payee = InferModel<typeof payees, 'select'>
export type NewPayee = InferModel<typeof payees, 'insert'>

export const payeeRelations = relations(payees, ({ one, many }) => ({
  account: one(accounts, {
    fields: [payees.accountId],
    references: [accounts.id],
  }),
  payments: many(payments),
  membership: one(memberships, {
    fields: [payees.membershipId],
    references: [memberships.id],
  }),
}))


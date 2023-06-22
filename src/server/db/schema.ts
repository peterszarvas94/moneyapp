import type { InferModel } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

// users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  clerk_id: varchar('clerk_id', { length: 256 }).notNull(),
});

export type User = InferModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  usersToAccounts: many(usersToAccounts),
}));

// accounts which can hold events
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }),
  currency: varchar('currency', { length: 256 }).notNull(),
  created_at: date('created_at').notNull().defaultNow(),
  updated_at: date('updated_at').notNull().defaultNow()
});

export type Account = InferModel<typeof accounts>;

export const accountsRelations = relations(accounts, ({ many }) => ({
  usersToAccounts: many(usersToAccounts),
}));

// accounts to users (admins, viewers)
export const usersToAccounts = pgTable('users_to_accounts', {
  id: serial('id').primaryKey(),
  account_id: integer('account_id').notNull(),
  user_id: integer('user_id').notNull(),
  role: varchar('role', { length: 256, enum: ['admin', 'viewer'], }).notNull(),
  created_at: date('created_at').notNull().defaultNow(),
  updated_at: date('updated_at').notNull().defaultNow()
});

export type AccountToUser = InferModel<typeof usersToAccounts>;

export const usersToAccountsRelations = relations(usersToAccounts, ({ one }) => ({
  users: one(users, {
    fields: [usersToAccounts.user_id],
    references: [users.id]
  }),
  accounts: one(accounts, {
    fields: [usersToAccounts.account_id],
    references: [accounts.id]
  }),
}));



// events which you can add transactions to
// export const events = pgTable('events', {
//   id: serial('id').primaryKey(),
//   account_id: integer('account_id').references(() => accounts.id).notNull(),
//   name: varchar('name', { length: 256 }).notNull(),
//   description: varchar('description', { length: 256 }),
//   event_date: date('event_date'),
//   transactions: integer('transactions').references(() => transactions.id).array(),
//   created_at: date('created_at').notNull().defaultNow(),
//   updated_at: date('updated_at').notNull().defaultNow()
// });
//
// export type Event = InferModel<typeof events>;

// incomes and expenses
// export const transactions = pgTable('transactions', {
//   id: serial('id').primaryKey(),
//   account_id: integer('account_id').references(() => accounts.id).notNull(),
//   amount: integer('amount').notNull().default(0),
//   name: varchar('name', { length: 256 }).notNull(),
//   description: varchar('description', { length: 256 }),
//   type: varchar('category', { length: 256, enum: ['income', 'expense'], }).notNull(),
//   paid: boolean('paid').notNull().default(false),
//   paid_date: date('paid_date'),
//   partner: integer('payee_id').references(() => partners.id).notNull(),
//   created_at: date('created_at').notNull().defaultNow(),
//   updated_at: date('updated_at').notNull().defaultNow()
// });
//
// export type Transaction = InferModel<typeof transactions>;



// partners for transactions, sender or receiver
// export const partners = pgTable('partners', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 256 }).notNull(),
//   created_at: date('created_at').notNull().defaultNow(),
//   updated_at: date('updated_at').notNull().defaultNow()
// });
//
// export type Partner = InferModel<typeof partners>;

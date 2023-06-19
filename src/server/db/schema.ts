import { InferModel } from 'drizzle-orm';
import { boolean, date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

// accounts which can hold incomes and expenses
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }),
  currency: varchar('currency', { length: 256 }).notNull(),
  admins: varchar('admins', { length: 256 }).array(),
  viewers: varchar('viewers', { length: 256 }).array(),
  created_at: date('created_at').notNull().defaultNow(),
  updated_at: date('updated_at').notNull().defaultNow()
});

export type Account = InferModel<typeof accounts>;

// incomes and expenses
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  account_id: integer('account_id').references(() => accounts.id).notNull(),
  amount: integer('amount').notNull().default(0),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }),
  type: varchar('category', { length: 256, enum: ['income', 'expense'], }).notNull(),
  paid: boolean('paid').notNull().default(false),
  paid_date: date('paid_date'),
  partner: integer('payee_id').references(() => partners.id).notNull(),
  created_at: date('created_at').notNull().defaultNow(),
  updated_at: date('updated_at').notNull().defaultNow()
});

export type Transaction = InferModel<typeof transactions>;

// events which you can add transactions to
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  account_id: integer('account_id').references(() => accounts.id).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 256 }),
  event_date: date('event_date'),
  transactions: integer('transactions').references(() => transactions.id).array(),
  created_at: date('created_at').notNull().defaultNow(),
  updated_at: date('updated_at').notNull().defaultNow()
});

export type Event = InferModel<typeof events>;

// partners for transactions, sender or receiver
export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  clerk_id: varchar('clerk_id', { length: 256 }),
  created_at: date('created_at').notNull().defaultNow(),
  updated_at: date('updated_at').notNull().defaultNow()
});

export type Partner = InferModel<typeof partners>;

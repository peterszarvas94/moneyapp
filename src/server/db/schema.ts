import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, serial, varchar } from 'drizzle-orm/pg-core';

// users who register to the site
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const userRelations = relations(users, ({ many }) => ({
  accountAdmins: many(accountAdmins),
  accountViewers: many(accountViewers),
  payees: many(payees),
}));

// accounts which can hold incomes and expenses
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  currency: varchar('currency', { length: 256 }),
});

export const accountRelations = relations(accounts, ({ many }) => ({
  accountAdmins: many(accountAdmins),
  incomes: many(incomes),
  expenses: many(expenses),
}));

// join accounts and users to define account admins
export const accountAdmins = pgTable('account_admins', {
  userId: integer('user_id').notNull().references(() => users.id),
  accountId: integer('account_id').notNull().references(() => accounts.id),
}, (t) => ({
  pk: primaryKey(t.userId, t.accountId),
}));

export const accountAdminRelations = relations(accountAdmins, ({ one }) => ({
  user: one(users, {
    fields: [accountAdmins.userId],
    references: [users.id],
  }),
  account: one(accounts, {
    fields: [accountAdmins.accountId],
    references: [accounts.id],
  }),
}));

// join accounts and users to define account viewers
export const accountViewers = pgTable('account_viewers', {
  userId: integer('user_id').notNull().references(() => users.id),
  accountId: integer('account_id').notNull().references(() => accounts.id),
}, (t) => ({
  pk: primaryKey(t.userId, t.accountId),
}));

export const accountViewerRelations = relations(accountViewers, ({ one }) => ({
  user: one(users, {
    fields: [accountViewers.userId],
    references: [users.id],
  }),
  account: one(accounts, {
    fields: [accountViewers.accountId],
    references: [accounts.id],
  }),
}));

// incomes
export const incomes = pgTable('incomes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  amount: integer('amount'),
  received: boolean('received'),
  accountId: integer('account_id').notNull().references(() => accounts.id),
});

export const incomeRelations = relations(incomes, ({ one, many }) => ({
  account: one(accounts, {
    fields: [incomes.accountId],
    references: [accounts.id],
  }),
  payments: many(payments),
  reserves: one(reserves),
}));

// expenses
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  amount: integer('amount'),
  paid: boolean('paid'),
  accountId: integer('account_id').notNull().references(() => accounts.id),
});

export const expenseRelations = relations(expenses, ({ one }) => ({
  account: one(accounts, {
    fields: [expenses.accountId],
    references: [accounts.id],
  }),
}));

// payments, parts of the income to pay out to payees
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  paid: boolean('paid'),
  incomeId: integer('income_id').notNull().references(() => incomes.id),
});

export const paymentRelations = relations(payments, ({ one, many }) => ({
  income: one(incomes, {
    fields: [payments.incomeId],
    references: [incomes.id],
  }),
  payee: one(payees),
  components: many(components),
}));

// components of the payments
export const components = pgTable('components', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  amount: integer('amount'),
  paymentId: integer('payment_id').notNull().references(() => payments.id),
});

export const componentRelations = relations(components, ({ one }) => ({
  payment: one(payments)
}));

// payees, people who receive payments
export const payees = pgTable('payees', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  userId: integer('user_id').notNull().references(() => users.id),
  paymentId: integer('payment_id').notNull().references(() => payments.id),
});

export const payeeRelations = relations(payees, ({ one }) => ({
  user: one(users, {
    fields: [payees.userId],
    references: [users.id],
  }),
  payments: one(payments, {
    fields: [payees.paymentId],
    references: [payments.id],
  }),
}));

// reserve part from the income for future use
export const reserves = pgTable('reserves', {
  id: serial('id').primaryKey(),
  incomeId: integer('income_id').notNull().references(() => incomes.id),
});

export const reserveRelations = relations(reserves, ({ one }) => ({
  income: one(incomes, {
    fields: [reserves.incomeId],
    references: [incomes.id],
  }),
}));


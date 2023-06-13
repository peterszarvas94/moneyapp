import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, primaryKey, serial, varchar } from 'drizzle-orm/pg-core';

// who registers to the site
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const userRelations = relations(users, ({ many }) => ({
  accountAdmins: many(accountAdmins),
}));

// accounts which can hold incomes and expenses
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  currency: varchar('currency', { length: 256 }),
});

export const accountRelations = relations(accounts, ({ many }) => ({
  accountAdmins: many(accountAdmins),
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



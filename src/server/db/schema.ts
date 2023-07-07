import { InferModel, relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  clerkId: text('clerk_id').notNull()
})

export type NewUser = InferModel<typeof users, 'insert'>

export const userRelations = relations(users, ({ many }) => ({
  accountAdmins: many(accountAdmins),
}))

export const accounts = sqliteTable('accounts', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
})

export type NewAccount = InferModel<typeof accounts, 'insert'>

export const accountRelations = relations(accounts, ({ many }) => ({
  accountAdmins: many(accountAdmins),
}))

export const accountAdmins = sqliteTable('account_admins', {
  adminId: integer('admin_id').notNull().references(() => users.id),
  accountId: integer('account_id').notNull().references(() => accounts.id),
}, (t) => ({
    pk: primaryKey(t.adminId, t.accountId)
  })
)

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

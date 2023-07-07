import { InferModel, relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  clerkId: text('clerk_id')
})

export type NewUser = InferModel<typeof users, 'insert'>

export const userRelations = relations(users, ({ many }) => ({
  accountAdmins: many(accountAdmins),
}))

export const account = sqliteTable('accounts', {
  id: integer('id').primaryKey(),
  name: text('name'),
  description: text('description'),
})

export type NewAccount = InferModel<typeof account, 'insert'>

export const accountRelations = relations(account, ({ many }) => ({
  accountAdmins: many(accountAdmins),
}))

export const accountAdmins = sqliteTable('account_admins', {
  adminId: integer('admin_id').notNull().references(() => users.id),
  accountId: integer('account_id').notNull().references(() => account.id),
}, (t) => ({
    pk: primaryKey(t.adminId, t.accountId)
  })
)

export const accountAdminsRelations = relations(accountAdmins, ({ one }) => ({
  account: one(account, {
    fields: [accountAdmins.accountId],
    references: [account.id],
  }),
  admin: one(users, {
    fields: [accountAdmins.adminId],
    references: [users.id],
  }),
}))

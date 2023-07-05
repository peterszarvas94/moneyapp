import { InferModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  clerkId: text('clerkID')
})

export type NewUser = InferModel<typeof users, 'insert'>

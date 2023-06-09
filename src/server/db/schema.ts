import { InferModel } from 'drizzle-orm';
import { pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
}, (users) => {
  return {
    nameIndex: uniqueIndex('name_idx').on(users.name),
  }
});

export type User = InferModel<typeof users>;

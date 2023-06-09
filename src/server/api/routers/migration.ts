import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/db";

export const migrationRouter = createTRPCRouter({
  migrate: publicProcedure
    .mutation(async () => {
      await migrate(db, { migrationsFolder: 'drizzle' });
    })
});

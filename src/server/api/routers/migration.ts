import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const migrationRouter = createTRPCRouter({
  migrate: publicProcedure
    .mutation(async ({ ctx }) => {
      await migrate(ctx.db, { migrationsFolder: 'drizzle' });
    })
});

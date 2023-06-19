import { migrationRouter } from "~/server/api/routers/migration";
import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { accountsRouter } from "./routers/accounts";
import { incomesRouter } from "./routers/incomes";
import { accountAdminsRouter } from "./routers/accountadmins";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  migration: migrationRouter,
  users: usersRouter,
  accounts: accountsRouter,
  accountAdmins: accountAdminsRouter,
  incomes: incomesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

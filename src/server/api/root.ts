import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { accountRouter } from "./routers/account";
import { accountAdminRouter } from "./routers/accountAdmin";
import { accountViewerRouter } from "./routers/accountViewer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  account: accountRouter,
  accountAdmin: accountAdminRouter,
  accountViewer: accountViewerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { accountRouter } from "./routers/account";
import { adminRouter } from "./routers/admin";
import { viewerRouter } from "./routers/viewer";
import { eventRouter } from "./routers/event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  account: accountRouter,
  admin: adminRouter,
  viewer: viewerRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

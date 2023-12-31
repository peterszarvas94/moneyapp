import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { accountRouter } from "./routers/account";
import { eventRouter } from "./routers/event";
import { payeeRouter } from "./routers/payee";
import { membershipRouter } from "./routers/membership";
import { paymentRouter } from "./routers/payment";

export const appRouter = createTRPCRouter({
  user: userRouter,
  account: accountRouter,
  membership: membershipRouter,
  event: eventRouter,
  payee: payeeRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

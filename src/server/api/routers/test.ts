import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const testRouter = createTRPCRouter({
  publicTest: publicProcedure
    .mutation(({ ctx }) => {
      console.log(ctx);
    }),

  privateTest: privateProcedure
    .mutation(({ ctx }) => {
      console.log(ctx);
    }),
});

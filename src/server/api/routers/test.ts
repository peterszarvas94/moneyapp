import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const testRouter = createTRPCRouter({
  publicTest: publicProcedure
    .mutation(async ({ ctx }) => {
      console.log(ctx);
    }),

  privateTest: privateProcedure
    .mutation(async ({ ctx }) => {
      console.log(ctx);
    }),
});

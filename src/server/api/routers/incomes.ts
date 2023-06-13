import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/db";
import { incomes } from "~/server/db/schema";

export const incomesRouter = createTRPCRouter({
  createIncome: publicProcedure
    .input(
      z.object({
        name: z.string(),
        amount: z.number(),
        received: z.boolean(),
        accountId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(incomes).values({
        name: input.name,
        amount: input.amount,
        received: input.received,
        accountId: input.accountId,
      })
    }),

  deleteIncome: publicProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(incomes).where(eq(incomes.id, input.id))
    }),

});

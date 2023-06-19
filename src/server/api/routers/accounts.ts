import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/db";
import { accounts, accountAdmins } from "~/server/db/schema";

export const accountsRouter = createTRPCRouter({
  createAccount: publicProcedure
    .input(
      z.object({
        name: z.string(),
        currency: z.string(),
      }))
    .mutation(async ({ input }) => {
      await db.insert(accounts).values({
        name: input.name,
        currency: input.currency,
      })
    }),
});

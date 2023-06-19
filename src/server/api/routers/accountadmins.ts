
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/db";
import { accountAdmins, accounts, users } from "~/server/db/schema";

export const accountAdminsRouter = createTRPCRouter({

  getUserByClerkId: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }))
    .mutation(async ({ input }) => {
      return await db.select().from(users).where(eq(users.clerkId, input.clerkId));
    }),

  addUserToAccountAdmins: publicProcedure
    .input(
      z.object({
        accountId: z.number(),
        userId: z.number(),
      }))
    .mutation(async ({ input }) => {
      await db.insert(accountAdmins).values({
        accountId: input.accountId,
        userId: input.userId,
      })
    }),

  deleteUserFromAccountAdmins: publicProcedure
    .input(
      z.object({
        accountId: z.number(),
        userId: z.number(),
      }))
    .mutation(async ({ input }) => {
      await db.delete(accountAdmins).where(
        and(
          eq(accountAdmins.accountId, input.accountId),
          eq(accountAdmins.userId, input.userId)
        )
      );
    }),

});

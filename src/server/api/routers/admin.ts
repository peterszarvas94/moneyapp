import type { Account, AccountAdmin, NewAccountAdmin } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, adminProcedure, createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { accountAdmins } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { getDateString } from "~/utils/date";

export const adminRouter = createTRPCRouter({
  getAccounts: loggedInProcedure
    .query(async ({ ctx }): Promise<Account[] | null> => {
      const { user: { id: adminId } } = ctx;

      try {
        const query = await ctx.db.query.accountAdmins.findMany({
          where: eq(accountAdmins.adminId, adminId),
          with: {
            account: true,
          },
        }).execute();
        const accounts: Account[] = query.map((r) => r.account);
        return accounts;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account search for admin failed",
        })
      }
    }),

  delete: adminProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { user, accountId } = ctx;
      const { userId: adminId } = input;

      if (user.id === adminId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin cannot delete themselves",
        })
      }

      try {
        await ctx.db.delete(accountAdmins).where(and(
          eq(accountAdmins.accountId, accountId),
          eq(accountAdmins.adminId, adminId),
        )).run();
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admin deletion failed",
        })
      }
    }),

  // old code
  new: loggedInProcedure
    .input(z.object({
      userId: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<AccountAdmin> => {
      const now = new Date();
      const { userId: adminId, accountId } = input;

      const newAccountAdmin: NewAccountAdmin = {
        adminId,
        accountId,
        createdAt: getDateString(now),
      }

      try {
        const accountAdmin = ctx.db.insert(accountAdmins).values(newAccountAdmin).returning().get();
        return accountAdmin;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admin creation failed",
        })
      }
    }),
  checkAccess: loggedInProcedure
    .input(z.object({
      userId: z.number().optional(),
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<boolean> => {
      const { userId: adminId, accountId } = input;

      if (!adminId || !accountId) {
        return false;
      }

      try {
        const query = await ctx.db.query.accountAdmins.findFirst({
          where: and(
            eq(accountAdmins.accountId, accountId),
            eq(accountAdmins.adminId, adminId),
          ),
        })
        if (!query) {
          return false;
        }
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Admin access check failed",
        })
      }
    }),


});

import type { Account, AccountViewer, NewAccountViewer, User } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountViewers } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const viewerRouter = createTRPCRouter({
  new: privateProcedure
    .input(z.object({
      userId: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const newAccountViewer: NewAccountViewer = {
        viewerId: input.userId,
        accountId: input.accountId,
      }

      let accountViewer: AccountViewer;
      try {
        const mutation = ctx.db.insert(accountViewers).values(newAccountViewer).returning();
        accountViewer = await mutation.get();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account viewer",
        })
      }

      return accountViewer;
    }),

  getAccounts: privateProcedure
    .input(z.object({
      userId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<Account[] | null> => {
      if (input.userId === undefined) {
        return null;
      }

      // get accounts for viewer
      let res: {
        account: Account
      }[] = [];

      if (!input.userId) {
        return res.map((r) => r.account);
      }

      try {
        res = await ctx.db.query.accountViewers.findMany({
          columns: {},
          where: eq(accountViewers.viewerId, input.userId),
          with: {
            account: true,
          },
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Accounts not found for viewer",
        })
      }

      // return accounts
      const accounts: Account[] = res.map((r) => r.account);
      return accounts;
    }),

  checkViewerAccess: privateProcedure
    .input(z.object({
      userId: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<boolean> => {
      // check if user is an viewer of the account
      let res: AccountViewer | undefined;
      try {
        res = await ctx.db.query.accountViewers.findFirst({
          columns: {
            viewerId: true,
            accountId: true,
          },
          where: and(
            eq(accountViewers.accountId, input.accountId),
            eq(accountViewers.viewerId, input.userId),
          ),
        })
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found for viewer",
        })
      }

      if (res === undefined) {
        return false;
      }

      return true;
    }),

  checkAccess: privateProcedure
    .input(z.object({
      userId: z.number().optional(),
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<boolean> => {
      if (input.userId === undefined || input.accountId === undefined) {
        return false;
      }

      // check if user is an admin of the account
      let res: AccountViewer | undefined;
      try {
        res = await ctx.db.query.accountViewers.findFirst({
          where: and(
            eq(accountViewers.accountId, input.accountId),
            eq(accountViewers.viewerId, input.userId),
          ),
        })
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Viewer access check failed",
        })
      }

      if (res === undefined) {
        return false;
      }

      return true;
    }),



  delete: privateProcedure
    .input(z.object({
      userId: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      try {
        await ctx.db.delete(accountViewers).where(and(
          eq(accountViewers.accountId, input.accountId),
          eq(accountViewers.viewerId, input.userId),
        )).run();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete account admin",
        })
      }

      return true;
    }),
});

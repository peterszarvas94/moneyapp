import type { Account, AccountViewer, NewAccountViewer } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, adminProcedure, createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { accountViewers } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { getDateString } from "~/utils/date";

export const viewerRouter = createTRPCRouter({
    getAccounts: loggedInProcedure
    .query(async ({ ctx }): Promise<Account[] | null> => {
      const { user: { id: viewerId } } = ctx;

      try {
        const query = await ctx.db.query.accountViewers.findMany({
          where: eq(accountViewers.viewerId, viewerId),
          with: {
            account: true,
          },
        }).execute();
        const accounts: Account[] = query.map((r) => r.account);
        return accounts;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account search for viewer failed",
        })
      }
    }),

  new: adminProcedure
    .input(z.object({
      userId: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<AccountViewer> => {
      const { userId: viewerId, accountId } = input;

      const newAccountViewer: NewAccountViewer = {
        viewerId,
        accountId,
        createdAt: getDateString(new Date),
      }

      try {
        const accountViewer = await ctx.db.insert(accountViewers).values(newAccountViewer).returning().get();
        return accountViewer;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account viewer creation failed",
        })
      }
    }),

  delete: adminProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { user, accountId } = ctx;
      const { userId: viewerId } = input;

      // this is not supposed to be happen, but just in case:
      if (user.id === viewerId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin cannot delete themselves from viewers",
        })
      }

      try {
        await ctx.db.delete(accountViewers).where(and(
          eq(accountViewers.accountId, accountId),
          eq(accountViewers.viewerId, viewerId),
        )).run();
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account viewer deletion failed",
        })
      }
    }),



  // old code
  checkAccess: loggedInProcedure
    .input(z.object({
      userId: z.number().optional(),
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<boolean> => {
      const { userId: viewerId, accountId } = input;

      if (!viewerId || !accountId) {
        return false;
      }

      try {
        const query = await ctx.db.query.accountViewers.findFirst({
          where: and(
            eq(accountViewers.accountId, accountId),
            eq(accountViewers.viewerId, viewerId),
          ),
        });
        if (!query) {
          return false;
        }
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Viewer access check failed",
        })
      }
    }),

});

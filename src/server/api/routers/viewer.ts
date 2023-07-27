import type { Account, AccountViewer, NewAccountViewer } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountViewers } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { getDateString } from "~/utils/date";

export const viewerRouter = createTRPCRouter({
  new: privateProcedure
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

  getAccounts: privateProcedure
    .input(z.object({
      userId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<Account[] | null> => {
      const { userId: viewerId } = input;

      if (!viewerId) {
        return null;
      }

      try {
        const query = await ctx.db.query.accountViewers.findMany({
          where: eq(accountViewers.viewerId, viewerId),
          with: {
            account: true,
          },
        }).execute();
        const account = query.map((r) => r.account);
        return account;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account search for viewer failed",
        })
      }
    }),

  checkAccess: privateProcedure
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

  delete: privateProcedure
    .input(z.object({
      userId: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { userId: viewerId, accountId } = input;

      try {
        await ctx.db.delete(accountViewers).where(and(
          eq(accountViewers.accountId, accountId),
          eq(accountViewers.viewerId, viewerId),
        )).run();
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Viewer deletion failed",
        })
      }
    }),
});

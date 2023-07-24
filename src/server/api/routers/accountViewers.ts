import type { Account, AccountViewer, NewAccountViewer, User } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountViewers, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const accountViewerRouter = createTRPCRouter({
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

  getViewersForAccount: privateProcedure
    .input(z.object({
      accountId: z.number()
    }))
    .query(async ({ input, ctx }): Promise<User[]> => {
      let accounts: {
        viewerId: number;
        accountId: number;
        viewer: {
          id: number;
          name: string;
          email: string;
          clerkId: string;
        };
      }[];
      try {
        accounts = await ctx.db.query.accountViewers.findMany({
          columns: {
            viewerId: true,
            accountId: true,
          },
          where: eq(accountViewers.accountId, input.accountId),
          with: {
            viewer: {
              columns: {
                id: true,
                name: true,
                email: true,
                clerkId: true,
              }
            }
          }
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        })
      }

      const viewers = accounts.map((a) => a.viewer);
      return viewers;
    }),

  getAccountsForViewer: privateProcedure
    .input(z.object({
      id: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<Account[]> => {
      // get accounts for viewer
      let res: {
        account: Account
      }[] = [];

      if (!input.id) {
        return res.map((r) => r.account);
      }

      try {
        res = await ctx.db.query.accountViewers.findMany({
          columns: {},
          where: eq(accountViewers.viewerId, input.id),
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

  deleteAllForAccount: privateProcedure
    .input(z.object({
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      try {
        await ctx.db.delete(accountViewers).where(eq(accountViewers.accountId, input.accountId)).run();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete account admins",
        })
      }

      return true;
    }),
});

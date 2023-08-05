import type { Account, AccountViewer, NewAccountViewer } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, adminProcedure, createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { accountViewers, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

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
      userId: z.string(),
      accountId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { userId: viewerId, accountId } = input;

      const newAccountViewer: NewAccountViewer = {
        viewerId,
        accountId,
        createdAt: new Date(),
      }

      try {
        await ctx.db.insert(accountViewers).values(newAccountViewer);
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account viewer creation failed",
        })
      }
    }),

  delete: adminProcedure
    .input(z.object({
      userId: z.string(),
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
        ));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account viewer deletion failed",
        })
      }
    }),

  checkAccessByEmail: adminProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }): Promise<boolean> => {
      const { email } = input;
      const { accountId } = ctx;

      let userId: string;
      try {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.email, email),
        })
        if (!user) {
          return false;
        }
        userId = user.id;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User search by email failed",
        })
      }

      try {
        const admin = await ctx.db.query.accountViewers.findFirst({
          where: and(
            eq(accountViewers.accountId, accountId),
            eq(accountViewers.viewerId, userId),
          ),
        })
        if (!admin) {
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

   addByEmail: adminProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { email } = input;
      const { accountId } = ctx;

      let userId: string;
      try {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.email, email),
        })

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          })
        }

        userId = user.id;
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User search by email failed",
        })
      }

      const now = new Date();

      const newAccountViewer: NewAccountViewer = {
        viewerId: userId,
        accountId,
        createdAt: now,
      }

      try {
        await ctx.db.insert(accountViewers).values(newAccountViewer);
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account viewer creation failed",
        })
      }
    }),


  // old
  checkAccess: loggedInProcedure
    .input(z.object({
      userId: z.string().optional(),
      accountId: z.string().optional(),
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

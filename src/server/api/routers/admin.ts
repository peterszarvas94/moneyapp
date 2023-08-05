import type { Account, NewAccountAdmin } from "~/server/db/schema";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { accountAdmins, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

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
      userId: z.string(),
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
        ))
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admin deletion failed",
        })
      }
    }),

  new: loggedInProcedure
    .input(z.object({
      userId: z.string(),
      accountId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { userId: adminId, accountId } = input;
      const now = new Date();

      const newAccountAdmin: NewAccountAdmin = {
        adminId,
        accountId,
        createdAt: now,
      }

      try {
        ctx.db.insert(accountAdmins).values(newAccountAdmin);
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admin creation failed",
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
        const admin = await ctx.db.query.accountAdmins.findFirst({
          where: and(
            eq(accountAdmins.accountId, accountId),
            eq(accountAdmins.adminId, userId),
          ),
        })
        if (!admin) {
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

      const newAccountAdmin: NewAccountAdmin = {
        adminId: userId,
        accountId,
        createdAt: now,
      }

      try {
        await ctx.db.insert(accountAdmins).values(newAccountAdmin);
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admin creation failed",
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

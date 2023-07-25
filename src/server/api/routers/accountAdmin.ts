import type { Account, AccountAdmin, NewAccountAdmin, User } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountAdmins } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const accountAdminRouter = createTRPCRouter({
  new: privateProcedure
    .input(z.object({
      userId: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const newAccountAdmin: NewAccountAdmin = {
        adminId: input.userId,
        accountId: input.accountId,
      }

      let accountAdmin: AccountAdmin;
      try {
        const mutation = ctx.db.insert(accountAdmins).values(newAccountAdmin).returning();
        accountAdmin = await mutation.get();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account admin",
        })
      }

      return accountAdmin;
    }),

  getAdminsForAccount: privateProcedure
    .input(z.object({
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<User[] | null> => {
      if (input.accountId === undefined) {
        return null;
      }

      let accounts: {
        adminId: number;
        accountId: number;
        admin: {
          id: number;
          name: string;
          email: string;
          clerkId: string;
        };
      }[];
      try {
        accounts = await ctx.db.query.accountAdmins.findMany({
          columns: {
            accountId: true,
            adminId: true,
          },
          where: eq(accountAdmins.accountId, input.accountId),
          with: {
            admin: {
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

      const admins = accounts.map((a) => a.admin);
      return admins;
    }),

  getAccountsForAdmin: privateProcedure
    .input(z.object({
      userId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<Account[] | null> => {
      if (input.userId === undefined) {
        return null;
      }

      // get accounts for admin
      let res: {
        account: Account
      }[] = [];

      try {
        res = await ctx.db.query.accountAdmins.findMany({
          columns: {},
          where: eq(accountAdmins.adminId, input.userId),
          with: {
            account: true,
          },
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Accounts not found for admin",
        })
      }

      // return accounts
      const accounts: Account[] = res.map((r) => r.account);
      return accounts;
    }),

  checkAdminAccess: privateProcedure
    .input(z.object({
      userId: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<boolean> => {
      // check if user is an admin of the account
      let res: AccountAdmin | undefined;
      try {
        res = await ctx.db.query.accountAdmins.findFirst({
          columns: {
            adminId: true,
            accountId: true,
          },
          where: and(
            eq(accountAdmins.accountId, input.accountId),
            eq(accountAdmins.adminId, input.userId),
          ),
        })
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found for admin",
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
      let res: AccountAdmin | undefined;
      try {
        res = await ctx.db.query.accountAdmins.findFirst({
          where: and(
            eq(accountAdmins.accountId, input.accountId),
            eq(accountAdmins.adminId, input.userId),
          ),
        })
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Admin access check failed",
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
        await ctx.db.delete(accountAdmins).where(and(
          eq(accountAdmins.accountId, input.accountId),
          eq(accountAdmins.adminId, input.userId),
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
        await ctx.db.delete(accountAdmins).where(eq(accountAdmins.accountId, input.accountId)).run();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete account admins",
        })
      }

      return true;
    }),
});

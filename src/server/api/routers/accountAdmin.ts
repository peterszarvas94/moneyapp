import type { Account, AccountAdmin, NewAccountAdmin } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountAdmins, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

export const accountAdminRouter = createTRPCRouter({
  new: privateProcedure
    .input(z.object({
      clerkId: z.string(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      // get user by clerk ID
      let user: { id: number } | undefined;
      try {
        user = await ctx.db.query.users.findFirst({
          columns: {
            id: true,
          },
          where: eq(users.clerkId, input.clerkId),
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found by clerk ID",
        })
      }

      if (user === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found by clerk ID",
        })
      }

      const newAccountAdmin: NewAccountAdmin = {
        adminId: user.id,
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
      if (accountAdmin === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create account admin",
        })
      }

      return accountAdmin;
    }),

  getAccountsForAdminByClerkId: privateProcedure
    .input(z.object({
      clerkId: z.string()
    }))
    .query(async ({ input, ctx }) => {
      // get user by clerk ID
      let user: { id: number } | undefined;
      try {
        user = await ctx.db.query.users.findFirst({
          columns: {
            id: true,
          },
          where: eq(users.clerkId, input.clerkId),
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found by clerk ID",
        })
      }

      if (user === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found by clerk ID",
        })
      }

      // get accounts for admin
      let res: {
        account: Account
      }[]
      try {
        res = await ctx.db.query.accountAdmins.findMany({
          columns: {},
          where: eq(accountAdmins.adminId, user.id),
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

  checkAdminAccessByClerkId: privateProcedure
    .input(z.object({
      clerkId: z.string(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<AccountAdmin> => {
      // get user by clerk ID
      let user: { id: number } | undefined;
      try {
        user = await ctx.db.query.users.findFirst({
          columns: {
            id: true,
          },
          where: eq(users.clerkId, input.clerkId),
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User can not be searched by clerk ID",
        })
      }

      if (user === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found by clerk ID",
        })
      }

      // check if user is an admin of the account
      let res: AccountAdmin | undefined;
      try {
        res = await ctx.db.query.accountAdmins.findFirst({
          columns: {
            adminId: true,
            accountId: true,
          },
          where: eq(accountAdmins.adminId, user.id),
        })
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found for admin",
        })
      }

      if (res === undefined) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not an admin of this account",
        })
      }

      return res;
    }),

  delete: privateProcedure
    .input(z.object({
      clerkId: z.string(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      // get user by clerk ID
      let user: { id: number } | undefined;
      try {
        user = await ctx.db.query.users.findFirst({
          columns: {
            id: true,
          },
          where: eq(users.clerkId, input.clerkId),
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User can not be searched by clerk ID",
        })
      }

      if (user === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found by clerk ID",
        })
      }
      // delete account admin
      try {
        await ctx.db.delete(accountAdmins).where(
          and(
            eq(accountAdmins.adminId, user.id),
            eq(accountAdmins.accountId, input.accountId),
          )
        ).run();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete account admin",
        })
      }

      return true;
    }),
});

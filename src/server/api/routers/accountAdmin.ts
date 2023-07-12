import type { Account, NewAccountAdmin } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountAdmins, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const accountAdminRouter = createTRPCRouter({
  new: privateProcedure
    .input(z.object({
      adminId: z.number(),
      accountId: z.number(),
    }))
    .mutation(({ input, ctx }) => {
      const newAccountAdmin: NewAccountAdmin = {
        adminId: input.adminId,
        accountId: input.accountId,
      }

      const mutation = ctx.db.insert(accountAdmins).values(newAccountAdmin).returning();
      const res = mutation.get();

      if (res === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        })
      }

      return res;
    }),

  getAccountsForAdminByClerkId: privateProcedure
    .input(z.object({
      clerkId: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {
      // check if clerk ID is defined
      if (input.clerkId === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Clerk ID is not defined",
        })
      }

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
      clerkId: z.string().optional(),
      accountId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      // check if clerk ID is defined
      if (input.clerkId === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Clerk ID is not defined",
        })
      }

      // check if account ID is defined
      if (input.accountId === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account ID is not defined",
        })
      }

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
        // throw new TRPCError({
        //   code: "NOT_FOUND",
        //   message: "User can not be searched by clerk ID",
        // })
        console.log(e);
      }

      if (user === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found by clerk ID",
        })
      }

      // check if user is an admin of the account
      let res: {} | undefined;
      try {
        res = await ctx.db.query.accountAdmins.findFirst({
          columns: {},
          where: eq(accountAdmins.adminId, user.id),
        }).execute();
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

      return true;
    }),
});

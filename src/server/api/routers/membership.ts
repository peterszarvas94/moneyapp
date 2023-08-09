import type { Account } from "~/server/db/schema";
import { memberships } from "~/server/db/schema";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, loggedInProcedure, userProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { Access } from "~/utils/types";
import { nanoid } from "nanoid";

type GetAccountType = {
  access: Access;
  account: Account;
};

export const membershipRouter = createTRPCRouter({
  getAccounts: loggedInProcedure
    .query(async ({ ctx }): Promise<GetAccountType[] | null> => {
      const { id: userId } = ctx.self.user;

      try {
        const accounts = await ctx.db.query.memberships.findMany({
          columns: {
            access: true
          },
          where: eq(memberships.userId, userId),
          with: {
            account: true,
          },
        }).execute();
        return accounts;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account search for role creation failed",
        })
      }
    }),

  delete: adminProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { userId } = input;
      const { accountId } = ctx;

      try {
        await ctx.db.delete(memberships).where(and(
          eq(memberships.userId, userId),
          eq(memberships.accountId, accountId),
        ));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Role deletion failed",
        })
      }
    }),

  addByEmail: userProcedure
    .input(z.object({
      access: z.enum(["admin", "viewer"]),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { access } = input;
      const { accountId } = ctx;
      const { user, access: existingAccess } = ctx.check;

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user found",
        })
      }
    
      if (existingAccess === "admin" || existingAccess === "viewer") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already an admin or viewer",
        })
      }

      const { id: userId } = user;

      try {
        const now = new Date();
        await ctx.db.insert(memberships).values({
          id: nanoid(),
          userId,
          accountId,
          access,
          createdAt: now,
          updatedAt: now,
        })

        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Role creation failed",
        })
      }
    }),

});

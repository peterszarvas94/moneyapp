import type { Account, Membership } from "~/server/db/schema";
import { memberships } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, adminProcedure, createTRPCRouter, loggedInProcedure, userProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { Access, Member } from "~/utils/types";
import { nanoid } from "nanoid";

type GetAccountType = {
  access: Access;
  account: Account;
};

export const membershipRouter = createTRPCRouter({
  get: accessedProcedure
    .input(z.object({
      membershipId: z.string(),
    }))
    .query(async ({ input, ctx }): Promise<Member | null> => {
      const { membershipId } = input;

      let membership: Member | undefined;
      try {
        membership = await ctx.db.query.memberships.findFirst({
          where: eq(memberships.id, membershipId),
          with: {
            user: true,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Membership retrieval failed",
        })
      }

      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership not found",
        })
      }

      return membership;
    }),

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
          message: "Account search for membership creation failed",
        })
      }
    }),

  delete: adminProcedure
    .input(z.object({
      membershipId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { membershipId } = input;

      let membership: Membership | undefined;
      try {
        membership = await ctx.db.query.memberships.findFirst({
          with: {
            user: true,
          },
          where: and(
            eq(memberships.id, membershipId),
          ),
        });

      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Membership retrieval failed",
        })
      }

      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membership not found",
        })
      }

      if (membership.userId === ctx.self.user.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot delete self",
        })
      }
      try {
        await ctx.db.delete(memberships).where(and(
          eq(memberships.id, membershipId),
        ));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Membership deletion failed",
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
          message: "Membership creation failed",
        })
      }
    }),

  update: adminProcedure
    .input(z.object({
      membershipId: z.string(),
      access: z.enum(["admin", "viewer"]),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { membershipId, access } = input;

      let membership: Membership | undefined;
      try {
        membership = await ctx.db.query.memberships.findFirst({
          where: and(
            eq(memberships.id, membershipId),
          ),
        });

      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Member retrieval failed",
        })
      }

      if (!membership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        })
      }

      if (membership.userId === ctx.self.user.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot update self",
        })
      }

      try {
        await ctx.db.update(memberships).set({
          access,
        }).where(and(
          eq(memberships.id, membershipId),
        ));

        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Membership update failed",
        })
      }
    }),

});

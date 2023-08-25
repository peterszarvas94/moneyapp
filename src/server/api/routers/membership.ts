import type { Membership, User } from "~/server/db/schema";
import type { AccessWithAccount, Member } from "~/utils/types";
import { memberships, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { accessedProcedure, createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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
    .query(async ({ ctx }): Promise<AccessWithAccount[] | null> => {
      const { id: userId } = ctx.self.user;

      try {
        const accessWithAccount = await ctx.db.query.memberships.findMany({
          columns: {
            access: true
          },
          where: eq(memberships.userId, userId),
          with: {
            account: true,
          },
        }).execute();
        return accessWithAccount;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account search for membership creation failed",
        })
      }
    }),

  delete: accessedProcedure
    .input(z.object({
      membershipId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete memberships",
        })
      }

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

  addByEmail: accessedProcedure
    .input(z.object({
      email: z.string().email(),
      access: z.enum(["admin", "viewer"]),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can add members",
        })
      }

      const { email, access: newAccess } = input;
      const { accountId } = ctx;

      // get the user by email
      let user: User | undefined = undefined;
      try {
        user = await ctx.db.query.users.findFirst({
          where: eq(users.email, email)
        });

      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User retrieval failed",
        })
      }

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user found",
        })
      }

      // check if user already a member
      let membership: Membership | undefined;
      try {
        membership = await ctx.db.query.memberships.findFirst({
          where: and(
            eq(memberships.userId, user.id),
            eq(memberships.accountId, accountId)
          )
        })
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Access retrieval failed"
        })
      }

      if (membership) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already a member",
        })
      }

      const { id: userId } = user;
      const now = new Date();

      try {
        await ctx.db.insert(memberships).values({
          id: nanoid(),
          userId,
          accountId,
          access: newAccess,
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


  update: accessedProcedure
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

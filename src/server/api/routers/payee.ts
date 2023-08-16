import { z } from "zod";
import { accessedProcedure, adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { Membership, Payee, User, memberships, payees, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";
import { Member, PayeeWithMember } from "~/utils/types";

export const payeeRouter = createTRPCRouter({
  new: adminProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input, ctx }): Promise<string> => {
      const { name, email } = input;
      const { accountId } = ctx;

      let membership: Membership | undefined;

      if (email) {
        let user: User | undefined;
        try {
          user = await ctx.db.query.users.findFirst({
            where: eq(users.email, email),
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
            message: "User not found",
          })
        }

        try {
          membership = await ctx.db.query.memberships.findFirst({
            where: and(
              eq(memberships.userId, user.id),
              eq(memberships.accountId, accountId),
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

        let existingPayee: Payee | undefined;
        try {
          existingPayee = await ctx.db.query.payees.findFirst({
            where: and(
              eq(payees.membershipId, membership.id),
            ),
          });
        } catch (e) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Payee retrieval failed",
          })
        }

        if (existingPayee) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Payee already exists with the same email",
          })
        }
      }

      const id = nanoid();
      const now = new Date();
      const membershipId = membership?.id ?? null;
      try {
        await ctx.db.insert(payees).values({
          id,
          name,
          accountId,
          membershipId,
          createdAt: now,
          updatedAt: now,
        })
        return id;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payee creation failed",
        })
      }
    }),

  get: accessedProcedure
    .input(z.object({
      payeeId: z.string(),
    }))
    .query(async ({ input, ctx }): Promise<PayeeWithMember> => {
      const { payeeId } = input;
      const { accountId } = ctx;

      let payee: Payee | undefined;
      try {
        payee = await ctx.db.query.payees.findFirst({
          where: and(
            eq(payees.id, payeeId),
            eq(payees.accountId, accountId),
          ),
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payee retrieval failed",
        })
      }

      if (!payee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payee not found",
        })
      }

      let member: Member | undefined;
      if (payee.membershipId) {
        try {
          member = await ctx.db.query.memberships.findFirst({
            where: eq(memberships.id, payee.membershipId),
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

        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Membership not found",
          })
        }
      }

      return {
        payee,
        member: member || null,
      }
    }),

  delete: adminProcedure
    .input(z.object({
      payeeId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { payeeId } = input;

      try {
        await ctx.db.delete(payees).where(eq(payees.id, payeeId));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payee deletion failed",
        })
      }
    }),

  update: adminProcedure
    .input(z.object({
      payeeId: z.string(),
      name: z.string(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { payeeId, name, email } = input;
      const { accountId } = ctx;

      let membership: Membership | undefined;

      if (email) {
        let user: User | undefined;
        try {
          user = await ctx.db.query.users.findFirst({
            where: eq(users.email, email),
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
            message: "User not found",
          })
        }

        try {
          membership = await ctx.db.query.memberships.findFirst({
            where: and(
              eq(memberships.userId, user.id),
              eq(memberships.accountId, accountId),
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
      }

      const membershipId = membership?.id ?? null;

      try {
        await ctx.db.update(payees).set({
          name,
          membershipId,
          updatedAt: new Date(),
        }).where(eq(payees.id, payeeId));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payee update failed",
        })
      }
    }),


});

import { z } from "zod";
import { adminProcedure, createTRPCRouter} from "~/server/api/trpc";
import { Membership, Payee, User, memberships, payees, users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";

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

});

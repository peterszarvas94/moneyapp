import { z } from "zod";
import { accessedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { NewPayment, payments } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export const paymentRouter = createTRPCRouter({
  new: accessedProcedure
    .input(z.object({
      factor: z.number().int().min(1),
      extra: z.number().int().min(0),
      payeeId: z.string(),
      eventId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<string> => {
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create payments",
        })
      }

      const { accountId } = ctx;
      const { factor, extra, payeeId, eventId } = input;
      const now = new Date();

      const id = nanoid();
      const newPayment: NewPayment = {
        id,
        factor,
        extra,
        payeeId,
        accountId,
        eventId,
        createdAt: now,
        updatedAt: now,
      };

      try {
        await ctx.db.insert(payments).values(newPayment);
        return id;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payment",
        });
      }
    }),

  update: accessedProcedure
    .input(z.object({
      paymentId: z.string(),
      factor: z.number().int().min(0),
      extra: z.number().int().min(0),
      payeeId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<void> => {
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update payments",
        })
      }

      const { paymentId, factor, extra, payeeId } = input;

      try {
        await ctx.db.update(payments).set({
          factor,
          extra,
          payeeId,
          updatedAt: new Date(),
        }).where(
          eq(payments.id, paymentId)
        );
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update payment",
        });
      }
    }),
});

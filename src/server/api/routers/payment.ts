import type { Payment, NewPayment } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { payments } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getDateString } from "~/utils/date";

export const paymentRouter = createTRPCRouter({
  get: loggedInProcedure
    .input(z.object({
      paymentId: z.number().optional()
    }))
    .query(async ({ input, ctx }): Promise<Payment | null> => {
      const { paymentId } = input;

      if (!paymentId) {
        return null;
      }

      try {
        const payment = await ctx.db.query.payments.findFirst({
          where: eq(payments.id, paymentId),
        }).execute();

        if (!payment) {
          return null;
        }

        return payment;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payment retrieval failed",
        })
      }
    }),

  new: loggedInProcedure
    .input(z.object({
      eventId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<Payment> => {
      const { eventId } = input;

      const dateString = getDateString(new Date());

      const newPayment: NewPayment = {
        eventId,
        createdAt: dateString,
        updatedAt: dateString,
      }

      try {
        const payment = await ctx.db.insert(payments).values(newPayment).returning().get();
        return payment;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "payment creation failed",
        })
      }
    }),
});

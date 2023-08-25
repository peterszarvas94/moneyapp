import { z } from "zod";
import { accessedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { NewPayment, payments } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const paymentRouter = createTRPCRouter({
  new: accessedProcedure
    .input(z.object({
      multiplier: z.number().int().min(1),
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
      const { multiplier, extra, payeeId, eventId } = input;
      const now = new Date();

      const id = nanoid();
      const newPayment: NewPayment = {
        id,
        multiplier,
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

});

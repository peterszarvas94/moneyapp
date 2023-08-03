import type { Event, NewEvent, Payment } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { getDateString } from "~/utils/date";

export const eventRouter = createTRPCRouter({
  get: accessedProcedure
    .input(z.object({
      eventId: z.number()
    }))
    .query(async ({ input, ctx }): Promise<Event> => {
      const { eventId } = input;
      const { accountId } = ctx;

      let event: Event | undefined;
      try {
        event = await ctx.db.query.events.findFirst({
          where: and(
            eq(events.id, eventId),
            eq(events.accountId, accountId),
          ),
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event retrieval failed",
        })
      }

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found",
        })
      }

      return event;
    }),
  
  new: accessedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      income: z.number(),
      saving: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<Event> => {
      const { name, description, income, saving } = input;
      const { accountId } = ctx;

      const now = new Date();
      const dateString = getDateString(now);

      const newEvent: NewEvent = {
        name,
        description: description || null,
        income,
        saving,
        accountId,
        createdAt: dateString,
        updatedAt: dateString,
      }

      try {
        const event = await ctx.db.insert(events).values(newEvent).returning().get();
        return event;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event creation failed",
        })
      }
    }),

  // getPayments: loggedInProcedure
  //   .input(z.object({
  //     eventId: z.number().optional()
  //   }))
  //   .query(async ({ input, ctx }): Promise<Payment[] | null> => {
  //     const { eventId } = input;
  //
  //     if (!eventId) {
  //       return null;
  //     }
  //
  //     try {
  //       const payments = await ctx.db.query.payments.findMany({
  //         where: eq(events.id, eventId),
  //       });
  //
  //       if (!payments) {
  //         return null;
  //       }
  //
  //       return payments;
  //     } catch (e) {
  //       throw new TRPCError({
  //         code: "INTERNAL_SERVER_ERROR",
  //         message: "Payments retrieval failed",
  //       })
  //     }
  //   }),
});

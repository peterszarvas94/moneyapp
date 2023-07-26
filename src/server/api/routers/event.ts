import type { Event, NewEvent } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getDateString } from "~/utils/date";

export const eventRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({
      id: z.number().optional()
    }))
    .query(async ({ input, ctx }): Promise<Event | null> => {
      if (!input.id) {
        return null;
      }

      let event: Event | undefined;
      try {
        event = await ctx.db.query.events.findFirst({
          where: eq(events.id, input.id),
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account retrieval failed",
        })
      }

      if (!event) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        })
      }

      return event;
    }),

  new: privateProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      income: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<Event> => {
      const now = new Date();

      const newEvent: NewEvent = {
        name: input.name,
        description: input.description,
        income: input.income,
        accountId: input.accountId,
        createdAt: getDateString(now),
        updatedAt: getDateString(now),
      }

      try {
        const event = await ctx.db.insert(events).values(newEvent).returning().get();
        return event;
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create event",
        })
      }
    }),
});

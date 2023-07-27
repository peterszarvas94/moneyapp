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
      eventId: z.number().optional()
    }))
    .query(async ({ input, ctx }): Promise<Event | null> => {
      const { eventId } = input;

      if (!eventId) {
        return null;
      }

      try {
        const event = await ctx.db.query.events.findFirst({
          where: eq(events.id, eventId),
        }).execute();

        if (!event) {
          return null;
        }

        return event;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event retrieval failed",
        })
      }
    }),

  new: privateProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      income: z.number(),
      saving: z.number(),
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<Event> => {
      const { name, description, income, saving, accountId } = input;

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
});

import type { Event, NewEvent} from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, createTRPCRouter} from "~/server/api/trpc";
import { events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const eventRouter = createTRPCRouter({
  get: accessedProcedure
    .input(z.object({
      eventId: z.string()
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
    .mutation(async ({ input, ctx }): Promise<true> => {
      const id = nanoid();
      const { accountId } = ctx;
      const { name, description, income, saving } = input;
      const now = new Date();

      const newEvent: NewEvent = {
        id,
        name,
        description: description || null,
        income,
        saving,
        accountId,
        createdAt: now,
        updatedAt: now,
      }

      try {
        await ctx.db.insert(events).values(newEvent);
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event creation failed",
        })
      }
    }),
});

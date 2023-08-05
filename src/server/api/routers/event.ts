import type { Payment, Event, NewEvent } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { events, payments } from "~/server/db/schema";
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
      delivery: z.date(),
    }))
    .mutation(async ({ input, ctx }): Promise<string> => {
      const id = nanoid();
      const { accountId } = ctx;
      const { name, description, income, saving, delivery } = input;
      const now = new Date();

      if (saving > income) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Saving cannot be greater than income",
        })
      }

      const newEvent: NewEvent = {
        id,
        name,
        description: description || null,
        income,
        saving,
        delivery,
        accountId,
        createdAt: now,
        updatedAt: now,
      }

      try {
        await ctx.db.insert(events).values(newEvent);
        return id;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event creation failed",
        })
      }
    }),

  update: accessedProcedure
    .input(z.object({
      eventId: z.string(),
      name: z.string(),
      description: z.string().optional().nullable(),
      delivery: z.date(),
      income: z.number(),
      saving: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { accountId } = ctx;
      const { name, description, income, saving, delivery, eventId } = input;
      const now = new Date();

      if (saving > income) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Saving cannot be greater than income",
        })
      }

      try {
        await ctx.db.update(events).set({
          name,
          description: description || null,
          delivery,
          income,
          saving,
          updatedAt: now,
        }).where(and(
          eq(events.id, eventId),
          eq(events.accountId, accountId),
        ));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event update failed",
        })
      }
    }),

  delete: accessedProcedure
    .input(z.object({
      eventId: z.string()
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { eventId } = input;
      const { accountId } = ctx;

      try {
        await ctx.db.delete(events).where(and(
          eq(events.id, eventId),
          eq(events.accountId, accountId),
        ));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event deletion failed",
        })
      }
    }),

  getPayments: accessedProcedure
    .input(z.object({
      eventId: z.string()
    }))
    .query(async ({ input, ctx }): Promise<Payment[]> => {
      const { eventId } = input;
      const { accountId } = ctx;

      try {
        const myPayments = await ctx.db.query.payments.findMany({
          where: and(
            eq(payments.eventId, eventId),
            eq(payments.accountId, accountId),
          ),
        });

        if (!myPayments) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payments not found",
          })
        }

        return myPayments;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payments retrieval failed",
        })
      }
    }),
});

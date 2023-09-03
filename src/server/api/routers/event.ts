import type { Event, NewEvent } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { events, payments } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { PaymentWithPayee } from "~/utils/types";

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
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create events",
        })
      }

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
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update events",
        })
      }

      const { accountId } = ctx;
      const { name, description, income, delivery, eventId } = input;
      const now = new Date();

      try {
        await ctx.db.update(events).set({
          name,
          description: description || null,
          delivery,
          income,
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
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete events",
        })
      }

      const { eventId } = input;

      // delete payments
      try {
        await ctx.db.delete(payments).where(eq(payments.eventId, eventId));
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payments deletion failed",
        })
      }

      // delete event
      try {
        await ctx.db.delete(events).where(eq(events.id, eventId));
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
    .query(async ({ input, ctx }): Promise<PaymentWithPayee[]> => {
      const { eventId } = input;
      const { accountId } = ctx;

      let myPayments: PaymentWithPayee[] | undefined;
      try {
        myPayments = await ctx.db.query.payments.findMany({
          where: and(
            eq(payments.eventId, eventId),
            eq(payments.accountId, accountId),
          ),
          with: {
            payee: true,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payments retrieval failed",
        })
      }

      if (!payments) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payments not found",
        })
      }

      return myPayments;
    }),

});

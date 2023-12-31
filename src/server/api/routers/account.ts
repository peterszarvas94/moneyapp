import type { Access, Member } from "~/utils/types";
import type { Account, Event, NewAccount, Payee } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { accounts, events, payees, memberships, payments } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const accountRouter = createTRPCRouter({
  new: loggedInProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      currency: z.string()
    }))
    .mutation(async ({ input, ctx }): Promise<string> => {
      const accountId = nanoid();
      const { name, description, currency } = input;
      const now = new Date();

      const newAccount: NewAccount = {
        id: accountId,
        name,
        description: description || null,
        currency: currency,
        createdAt: now,
        updatedAt: now,
      }

      try {
        await ctx.db.insert(accounts).values(newAccount);
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account creation failed",
        })
      }

      const { id: userId } = ctx.self.user;
      try {
        await ctx.db.insert(memberships).values({
          id: nanoid(),
          userId,
          accountId: accountId,
          access: "admin",
          createdAt: now,
          updatedAt: now,
        })
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admin creation failed",
        })
      }

      return accountId;
    }),

  update: accessedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      currency: z.string()
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update accounts",
        })
      }

      const { accountId } = ctx;
      const { name, description, currency } = input;

      try {
        await ctx.db.update(accounts).set({
          name,
          description: description || null,
          currency,
          updatedAt: new Date(),
        }).where(eq(accounts.id, accountId));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account update failed",
        })
      }
    }),

  delete: accessedProcedure
    .mutation(async ({ ctx }): Promise<true> => {
      const { access } = ctx.self;
      if (access !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete accounts",
        })
      }

      const { accountId } = ctx;

      // delete events
      try {
        await ctx.db.delete(events).where(eq(events.accountId, accountId));
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Events deletion failed",
        })
      }

      // delete memberships
      try {
        await ctx.db.delete(memberships).where(eq(memberships.accountId, accountId));
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Memberships deletion failed",
        })
      }

      // delete payments
      try {
        await ctx.db.delete(payments).where(eq(payments.accountId, accountId));
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payments deletion failed",
        })
      }

      // delete payees
      try {
        await ctx.db.delete(payees).where(eq(payees.accountId, accountId));
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payees deletion failed",
        })
      }

      // delete account
      try {
        await ctx.db.delete(accounts).where(eq(accounts.id, accountId));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account deletion failed",
        })
      }
    }),

  checkAccess: accessedProcedure
    .mutation(async ({ ctx }): Promise<Access> => {
      const { access } = ctx.self;
      return access;
    }),

  get: accessedProcedure
    .query(async ({ ctx }): Promise<Account | null> => {
      const { accountId } = ctx;
      try {
        const account = await ctx.db.query.accounts.findFirst({
          where: eq(accounts.id, accountId),
        });
        if (!account) {
          return null;
        }
        return account;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account retrieval by accountId failed",
        })
      }
    }),

  getMembers: accessedProcedure
    .query(async ({ ctx }): Promise<Member[] | null> => {
      const { accountId } = ctx;

      try {
        const myMembers = await ctx.db.query.memberships.findMany({
          where: and(
            eq(memberships.accountId, accountId),
          ),
          with: {
            user: true,
          }
        });
        return myMembers;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admins retrieval by accountId failed",
        })
      }
    }),

  getEvents: accessedProcedure
    .query(async ({ ctx }): Promise<Event[] | null> => {
      const { accountId } = ctx;

      try {
        const queriedEvents = await ctx.db.query.events.findMany({
          where: eq(events.accountId, accountId),
          orderBy: [asc(events.delivery)],
        })
        return queriedEvents;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event retrieval by accountId failed",
        })
      }
    }),

  getPayees: accessedProcedure
    .query(async ({ ctx }): Promise<Payee[] | null> => {
      const { accountId } = ctx;

      try {
        const queriedPayees = await ctx.db.query.payees.findMany({
          where: eq(payees.accountId, accountId),
        });
        return queriedPayees;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payee retrieval by accountId failed",
        })
      }
    }),
});

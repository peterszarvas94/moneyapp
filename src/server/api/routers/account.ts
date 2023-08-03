import type { Access } from "~/utils/types";
import type { Account, User, Event, NewAccount } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, adminProcedure, createTRPCRouter, loggedInProcedure } from "~/server/api/trpc";
import { accountAdmins, accountViewers, accounts, events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq, and } from "drizzle-orm";

export const accountRouter = createTRPCRouter({
  getAccess: accessedProcedure
    .query(async ({ ctx }): Promise<Access | null> => {
      const { access } = ctx;
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

  getAdmins: accessedProcedure
    .query(async ({ ctx }): Promise<User[] | null> => {
      const { accountId } = ctx;

      try {
        const query = await ctx.db.query.accountAdmins.findMany({
          where: eq(accountAdmins.accountId, accountId),
          with: {
            admin: true,
          }
        });
        const admins: User[] = query.map((r) => r.admin);
        return admins;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admins retrieval by accountId failed",
        })
      }
    }),

  getViewers: accessedProcedure
    .query(async ({ ctx }): Promise<User[] | null> => {
      const { accountId } = ctx;

      try {
        const query = await ctx.db.query.accountViewers.findMany({
          where: eq(accountViewers.accountId, accountId),
          with: {
            viewer: true,
          }
        });
        const viewers: User[] = query.map((r) => r.viewer);
        return viewers;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account viewers retrieval by accountId failed",
        })
      }
    }),

  getEvents: accessedProcedure
    .query(async ({ ctx }): Promise<Event[] | null> => {
      const { accountId } = ctx;

      try {
        const queriedEvents = await ctx.db.query.events.findMany({
          where: eq(events.accountId, accountId),
        }).execute();
        return queriedEvents;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event retrieval by accountId failed",
        })
      }
    }),

  update: adminProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      currency: z.string()
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
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

  delete: adminProcedure
    .mutation(async ({ ctx }): Promise<true> => {
      const { accountId } = ctx;

      // delete events
      try {
        await ctx.db.delete(events).where(eq(events.accountId, accountId));
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Events deletion failed",
        })
      }

      // delete viewers
      try {
        await ctx.db.delete(accountViewers).where(eq(accountViewers.accountId, accountId));
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Viewers deletion failed",
        })
      }

      // delete admins
      try {
        await ctx.db.delete(accountAdmins).where(eq(accountAdmins.accountId, accountId));
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Admins deletion failed",
        })
      }

      // delete account
      try {
        await ctx.db.delete(accounts).where(eq(accounts.id, accountId));
        return true;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account deletion failed",
        })
      }
    }),

  // old code

  new: loggedInProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      currency: z.string()
    }))
    .mutation(async ({ input, ctx }): Promise<Account> => {
      const now = new Date();

      const { name, description, currency } = input;

      const newAccount: NewAccount = {
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

      const account = await ctx.db.query.accounts.findFirst({
        where: and(
          eq(accounts.name, name),
          eq(accounts.createdAt, now),
        ),
      });

      if (!account) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account retrieval by name and createdAt failed",
        })
      }

      const { user: { id: adminId } } = ctx;
      try {
        await ctx.db.insert(accountAdmins).values({
          adminId,
          accountId: account.id,
          createdAt: now,
        })
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account admin creation failed",
        })
      }

      return account;
    }),
});

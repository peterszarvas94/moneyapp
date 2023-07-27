import type { Event, Account, NewAccount, User } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountAdmins, accountViewers, accounts, events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getDateString } from "~/utils/date";

export const accountRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({
      accountId: z.number().optional()
    }))
    .query(async ({ input, ctx }): Promise<Account | null> => {
      const { accountId } = input;

      if (!accountId) {
        return null;
      }

      try {
        const account = await ctx.db.query.accounts.findFirst({
          where: eq(accounts.id, accountId),
        }).execute();

        if (!account) {
          return null;
        }

        return account;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account retrieval failed",
        })
      }
    }),

  new: privateProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      currency: z.string()
    }))
    .mutation(async ({ input, ctx }): Promise<Account> => {
      const now = new Date();
      const dateString = getDateString(now);

      const { name, description, currency } = input;

      const newAccount: NewAccount = {
        name,
        description: description || null,
        currency: currency,
        createdAt: dateString,
        updatedAt: dateString,
      }

      try {
        const account = await ctx.db.insert(accounts).values(newAccount).returning().get();
        return account;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account creation failed",
        })
      }
    }),

  update: privateProcedure
    .input(z.object({
      accountId: z.number(),
      name: z.string(),
      description: z.string(),
      currency: z.string()
    }))
    .mutation(async ({ input, ctx }): Promise<Account> => {

      const { accountId, name, description, currency } = input;

      let data: {
        name: string,
        description: string | null,
        currency: string,
        updatedAt: string,
      } = {
        name,
        description: description || null,
        currency,
        updatedAt: getDateString(new Date()),
      }

      try {
        const account = await ctx.db.update(accounts).set(data).where(eq(accounts.id, accountId)).returning().get();
        return account;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account update failed",
        })
      }
    }),

  delete: privateProcedure
    .input(z.object({
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { accountId } = input;

      try {
        await ctx.db.delete(accounts).where(eq(accounts.id, accountId)).run();
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account deletion failed",
        })
      }
    }),

  getAdmins: privateProcedure
    .input(z.object({
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<User[] | null> => {
      const { accountId } = input;

      if (!accountId) {
        return null;
      }

      try {
        const query = await ctx.db.query.accountAdmins.findMany({
          where: eq(accountAdmins.accountId, accountId),
          with: {
            admin: true,
          }
        }).execute();
        const admins = query.map((a) => a.admin);
        return admins;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Admin search for account failed",
        })
      }
    }),

  getViewers: privateProcedure
    .input(z.object({
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<User[] | null> => {
      const { accountId } = input;

      if (!accountId) {
        return null;
      }

      try {
        const query = await ctx.db.query.accountViewers.findMany({
          where: eq(accountViewers.accountId, accountId),
          with: {
            viewer: true,
          }
        }).execute();
        const viewers = query.map((a) => a.viewer);
        return viewers;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Viewer search for account failed",
        })
      }
    }),

  getEvents: privateProcedure
    .input(z.object({
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<Event[] | null> => {
      const { accountId } = input;

      if (!accountId) {
        return null;
      }

      try {
        const queriedEvents = await ctx.db.query.events.findMany({
          where: eq(events.accountId, accountId),
        }).execute();
        return queriedEvents;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Event search for account failed",
        })
      }
    }),

  deleteAdmins: privateProcedure
    .input(z.object({
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { accountId } = input;

      try {
        await ctx.db.delete(accountAdmins).where(eq(accountAdmins.accountId, accountId)).run();
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Admins deletion failed",
        })
      }
    }),

  deleteViewers: privateProcedure
    .input(z.object({
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { accountId } = input;

      try {
        await ctx.db.delete(accountViewers).where(eq(accountViewers.accountId, accountId)).run();
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Viewers deletion failed",
        })
      }
    }),

  deleteEvents: privateProcedure
    .input(z.object({
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { accountId } = input;

      try {
        await ctx.db.delete(events).where(eq(events.accountId, accountId)).run();
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Events deletion failed",
        })
      }
    }),
});

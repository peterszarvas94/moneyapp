import type { Event, Account, NewAccount, UpdateAccount, User } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountAdmins, accountViewers, accounts, events } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const accountRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({
      id: z.number().optional()
    }))
    .query(async ({ input, ctx }): Promise<Account | null> => {
      if (!input.id) {
        return null;
      }

      let account: Account | undefined;
      try {
        account = await ctx.db.query.accounts.findFirst({
          where: eq(accounts.id, input.id),
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account retrieval failed",
        })
      }

      if (!account) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        })
      }

      return account;
    }),

  new: privateProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional().nullable(),
      currency: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      // create new account 
      const newAccount: NewAccount = {
        name: input.name,
        description: input.description,
        currency: input.currency
      }

      let account: Account;
      try {
        const mutation = ctx.db.insert(accounts).values(newAccount).returning();
        account = await mutation.get();
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account creation failed",
        })
      }

      return account;
    }),

  edit: privateProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional().nullable(),
      currency: z.string().optional()
    }))
    .mutation(async ({ input, ctx }): Promise<Account> => {
      let data: UpdateAccount = {};
      if (!!input.name) {
        data.name = input.name;
      }
      if (!!input.description) {
        data.description = input.description;
      }
      if (!!input.currency) {
        data.currency = input.currency;
      }

      let account: Account;
      try {
        const mutation = ctx.db.update(accounts).set(data).where(eq(accounts.id, input.id)).returning();
        account = await mutation.get();
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account update failed",
        })
      }

      return account;
    }),

  delete: privateProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      try {
        await ctx.db.delete(accounts).where(eq(accounts.id, input.id)).run();
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account deletion failed",
        })
      }

      return true;
    }),

  getAdmins: privateProcedure
    .input(z.object({
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<User[] | null> => {
      if (input.accountId === undefined) {
        return null;
      }

      let accounts: {
        adminId: number;
        accountId: number;
        admin: {
          id: number;
          name: string;
          email: string;
          clerkId: string;
        };
      }[];
      try {
        accounts = await ctx.db.query.accountAdmins.findMany({
          columns: {
            accountId: true,
            adminId: true,
          },
          where: eq(accountAdmins.accountId, input.accountId),
          with: {
            admin: {
              columns: {
                id: true,
                name: true,
                email: true,
                clerkId: true,
              }
            }
          }
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        })
      }

      const admins = accounts.map((a) => a.admin);
      return admins;
    }),

  getViewers: privateProcedure
    .input(z.object({
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<User[] | null> => {
      if (input.accountId === undefined) {
        return null;
      }

      let accounts: {
        viewerId: number;
        accountId: number;
        viewer: {
          id: number;
          name: string;
          email: string;
          clerkId: string;
        };
      }[];
      try {
        accounts = await ctx.db.query.accountViewers.findMany({
          columns: {
            viewerId: true,
            accountId: true,
          },
          where: eq(accountViewers.accountId, input.accountId),
          with: {
            viewer: {
              columns: {
                id: true,
                name: true,
                email: true,
                clerkId: true,
              }
            }
          }
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        })
      }

      const viewers = accounts.map((a) => a.viewer);
      return viewers;
    }),

  getEvents: privateProcedure
    .input(z.object({
      accountId: z.number().optional(),
    }))
    .query(async ({ input, ctx }): Promise<Event[] | null> => {
      if (!input.accountId) {
        return null;
      }

      let res: Event[];
      try {
        res = await ctx.db.query.events.findMany({
          where: eq(events.accountId, input.accountId),
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Events not found",
        })
      }

      return res;
    }),

  deleteAdmins: privateProcedure
    .input(z.object({
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      try {
        await ctx.db.delete(accountAdmins).where(eq(accountAdmins.accountId, input.accountId)).run();
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to delete account admins",
        })
      }

      return true;
    }),

  deleteViewers: privateProcedure
    .input(z.object({
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      try {
        await ctx.db.delete(accountViewers).where(eq(accountViewers.accountId, input.accountId)).run();
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to delete account admins",
        })
      }

      return true;
    }),

  deleteEvents: privateProcedure
    .input(z.object({
      accountId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      try {
        await ctx.db.delete(events).where(eq(events.accountId, input.accountId)).run();
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to delete account events",
        })
      }

      return true;
    }),
});

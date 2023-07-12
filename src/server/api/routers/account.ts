import type { Account, NewAccount, UpdateAccount } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accounts } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const accountRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({
      id: z.number().optional()
    }))
    .query(async ({ input, ctx }) => {
      if (input.id === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account ID is not defined",
        })
      }

      let account: Account | undefined;
      try {
        account = await ctx.db.query.accounts.findFirst({
          columns: {
            id: true,
            name: true,
            description: true,
          },
          where: eq(accounts.id, input.id),
        }).execute();
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Account not found",
        })
      }

      if (account === undefined) {
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
    }))
    .mutation(({ input, ctx }) => {
      const newAccount: NewAccount = {
        name: input.name,
        description: input.description,
      }

      const mutation = ctx.db.insert(accounts).values(newAccount).returning();
      const res = mutation.get();

      if (res === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account creation failed",
        })
      }

      return res;
    }),

  edit: privateProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional().nullable(),
    }))
    .mutation(async ({ input, ctx }) => {

      let data: UpdateAccount = {};
      if (input.name !== undefined) {
        data.name = input.name;
      }
      if (input.description !== undefined) {
        data.description = input.description;
      }
      
      let account: Account;
      try {
        const mutation = ctx.db.update(accounts).set(data).where(eq(accounts.id, input.id)).returning();
        account = await mutation.get();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account update failed",
        })
      }

      return account;
    }),

  delete: privateProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      let account: Account | undefined;
      try {
        const mutation = ctx.db.delete(accounts).where(eq(accounts.id, input.id)).returning();
        account = await mutation.get();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account deletion failed",
        })
      }

      if (account === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account deletion failed",
        })
      }

      return account;
    }),
});

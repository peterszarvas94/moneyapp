import type { NewUser, User } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({
      id: z.number().optional()
    }))
    .query(async ({ input, ctx }) => {
      if (input.id === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User ID is not defined",
        })
      }

      let user: User | undefined;
      try {
        user = await ctx.db.query.users.findFirst({
          columns: {
            id: true,
            name: true,
            email: true,
            clerkId: true,
          },
          where: eq(users.id, input.id),
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      if (user === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      return user;
    }),

  getByClerkId: privateProcedure
    .input(z.object({
      clerkId: z.string().optional()
    }))
    .query(async ({ input, ctx }): Promise<User> => {
      if (input.clerkId === undefined) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User\'s clerkId is not defined",
        })
      }

      let user: User | undefined;
      try {
        user = await ctx.db.query.users.findFirst({
          columns: {
            id: true,
            name: true,
            email: true,
            clerkId: true,
          },
          where: eq(users.clerkId, input.clerkId),
        });
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      if (user === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      return user;
    }),

  getByEmail: privateProcedure
    .input(z.object({
      email: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      let user: User | undefined;
      try {
        user = await ctx.db.query.users.findFirst({
          columns: {
            id: true,
            name: true,
            email: true,
            clerkId: true,
          },
          where: eq(users.email, input.email),
        });
        return user;
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }
    }),

  new: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      clerkId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      const newUser: NewUser = {
        name: input.name,
        email: input.email,
        clerkId: input.clerkId,
      }

      const mutation = ctx.db.insert(users).values(newUser).returning();
      const res = mutation.get();

      if (res === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        })
      }

      return res;
    }),

  update: publicProcedure
    .input(z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      clerkId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      const mutation = ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.clerkId, input.clerkId))
        .returning()

      const res = mutation.get();
      if (res === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR"
        })
      }

      return res;
    }),

  delete: publicProcedure
    .input(z.object({
      clerkId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      const mutation = ctx.db
        .delete(users)
        .where(eq(users.clerkId, input.clerkId))
        .returning()

      const res = mutation.get()
      if (res === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR"
        })
      }

      return res;
    }),

})

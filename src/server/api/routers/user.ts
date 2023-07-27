import type { NewUser, User } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { getDateString } from "~/utils/date";

export const userRouter = createTRPCRouter({
  get: privateProcedure
    .input(z.object({
      userId: z.number().optional()
    }))
    .query(async ({ input, ctx }): Promise<User | null> => {
      const { userId } = input;

      if (!userId) {
        return null;
      }

      try {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        if (!user) {
          return null;
        }
        return user;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User retrieval failed",
        })
      }
    }),

  getByClerkId: privateProcedure
    .input(z.object({
      clerkId: z.string().optional()
    }))
    .query(async ({ input, ctx }): Promise<User | null> => {
      const { clerkId } = input;

      if (!clerkId) {
        return null;
      }

      try {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.clerkId, clerkId),
        });
        if (!user) {
          return null;
        }
        return user;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User retrieval by clerkId failed",
        })
      }
    }),

  getByEmail: privateProcedure
    .input(z.object({
      email: z.string()
    }))
    .mutation(async ({ input, ctx }): Promise<User | null> => {
      const { email } = input;

      try {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.email, email),
        });
        if (!user) {
          return null;
        }
        return user;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User retrieval by email failed",
        })
      }
    }),

  new: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      clerkId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<User> => {
      const now = new Date();
      const dateString = getDateString(now);

      const { name, email, clerkId } = input;

      const newUser: NewUser = {
        name,
        email,
        clerkId,
        createdAt: dateString,
        updatedAt: dateString,
      }

      try {
        const user = await ctx.db.insert(users).values(newUser).returning().get();
        return user;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account creation failed",
        })
      }
    }),

  update: privateProcedure
    .input(z.object({
      userId: z.number(),
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }): Promise<User> => {
      const { userId, name, email } = input;

      let data: {
        name: string,
        email: string,
        updatedAt: string,
      } = {
        name,
        email,
        updatedAt: getDateString(new Date()),
      }

      try {
        const user = await ctx.db.update(users).set(data).where(eq(users.id, userId)).returning().get();
        return user;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account update failed",
        })
      }
    }),

  delete: privateProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { userId } = input;
      try {
        await ctx.db.delete(users).where(eq(users.id, userId)).run();
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account deletion failed",
        })
      }
    }),
})

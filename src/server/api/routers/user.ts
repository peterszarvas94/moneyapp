import type { NewUser, User } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, loggedInProcedure, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const userRouter = createTRPCRouter({
  new: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      clerkId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const id = nanoid();
      const { name, email, clerkId } = input;
      const now = new Date();

      const newUser: NewUser = {
        id,
        name,
        email,
        clerkId,
        createdAt: now,
        updatedAt: now,
      }

      try {
        await ctx.db.insert(users).values(newUser);
        return true;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User creation failed",
        })
      }
    }),

  update: publicProcedure
    .input(z.object({
      clerkId: z.string(),
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { clerkId, name, email } = input;

      try {
        await ctx.db.update(users).set({
          name,
          email,
          clerkId,
          updatedAt: new Date(),
        }).where(eq(users.clerkId, clerkId));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account update failed",
        })
      }
    }),

  delete: publicProcedure
    .input(z.object({
      clerkId: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<true> => {
      const { clerkId } = input;
      try {
        await ctx.db.delete(users).where(eq(users.clerkId, clerkId));
        return true;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Account deletion failed",
        })
      }
    }),


  getByClerkId: loggedInProcedure
    .query(async ({ ctx }): Promise<User | null> => {
      const { clerkId } = ctx;
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

  getSelf: loggedInProcedure
    .query(async ({ ctx }): Promise<User | null> => {
      const { clerkId } = ctx;
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
          message: "User retrieval by userId failed",
        })
      }
    }),

  get: loggedInProcedure
    .input(z.object({
      userId: z.string().optional()
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

  getByEmail: loggedInProcedure
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

})

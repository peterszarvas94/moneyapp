import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/db";
import { users } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({

  singInOrSignUp: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }))
    .mutation(async ({ input }) => {
      const userList = await db.select().from(users).where(eq(users.clerkId, input.clerkId));
      if (userList.length !== 0) {
        return;
      }

      await db.insert(users).values({ clerkId: input.clerkId });
    }),

  createUser: publicProcedure
    .input(
      z.object({
        clerkId: z.string(),
      }))
    .mutation(async ({ input }) => {
      await db.insert(users).values({ clerkId: input.clerkId });
    }),

  getUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }))
    .query(async ({ input }) => {
      return await db.select().from(users).where(eq(users.id, input.id));
    }),

  getUsers: publicProcedure
    .query(async () => {
      return await db.select().from(users);
    }),

  deleteUser: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }))
    .mutation(async ({ input }) => {
      await db.delete(users).where(eq(users.id, input.id));
    }),

  deleteAllusers: publicProcedure
    .mutation(async () => {
      await db.delete(users);
    }),

});

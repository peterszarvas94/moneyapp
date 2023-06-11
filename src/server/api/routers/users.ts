import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db/db";
import { users } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }))
    .mutation(async ({ input }) => {
      await db.insert(users).values({ name: input.name })
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

});

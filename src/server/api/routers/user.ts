import type { NewUser } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getFromId: publicProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(({input, ctx}) => {
      const mutation = ctx.db.select().from(users).where(eq(users.id, input.id));
      const res = mutation.get();

      if (res === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
        })
      }
      
      return res;
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
      ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.clerkId, input.clerkId))
    }),

  delete: publicProcedure
    .input(z.object({
      clerkId: z.string(),
    }))
    .mutation(({ input, ctx }) => {
      ctx.db
        .delete(users)
        .where(eq(users.clerkId, input.clerkId))
    }),

});

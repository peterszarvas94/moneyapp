import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  new: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      clerkId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        clerk_id: input.clerkId,
      })
    }),

  update: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      clerkId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(users)
        .set({
          name: input.name,
          email: input.email,
        })
        .where(eq(users.clerk_id, input.clerkId))
    }),

  delete: publicProcedure
    .input(z.object({
      clerkId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .delete(users)
        .where(eq(users.clerk_id, input.clerkId))
    }),

});

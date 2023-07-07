import type { NewAccount } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure} from "~/server/api/trpc";
import { accounts } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const accountRouter = createTRPCRouter({
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
        })
      }

      return res;
    }),

});

import type { NewAccountAdmin } from "~/server/db/schema";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { accountAdmins } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const accountAdminRouter = createTRPCRouter({
  new: privateProcedure
    .input(z.object({
      adminId: z.number(),
      accountId: z.number(),
    }))
    .mutation(({ input, ctx }) => {
      const newAccountAdmin: NewAccountAdmin = {
        adminId: input.adminId,
        accountId: input.accountId,
      }

      const mutation = ctx.db.insert(accountAdmins).values(newAccountAdmin).returning();
      const res = mutation.get();

      if (res === undefined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        })
      }

      return res;
    }),

  getAccountsByAdminId: privateProcedure
    .input(z.object({
      adminId: z.number().optional()
    }))
    .query(({ input, ctx }) => {
      if (input.adminId === undefined) {
        throw new TRPCError({
          code: "NOT_FOUND",
        })
      }

      const res = ctx.db.query.accountAdmins.findMany({
        where: eq(accountAdmins.adminId, input.adminId),
        columns: {
          adminId: false,
          accountId: false,
        },
        with: {
          account: true,
        },
      });

      return res;
    })

});

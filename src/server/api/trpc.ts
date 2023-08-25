import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";
import { db } from "~/server/db/db";
import { getAuth } from "@clerk/nextjs/server";
import { Payment, User, Event, events, memberships, payments, users } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { EventWithPayments } from "~/utils/types";

// context:
export const createTRPCContext = (opts: CreateNextContextOptions) => {
  const { req } = opts;
  const sesh = getAuth(req);

  const { userId: clerkId } = sesh;

  return {
    db,
    self: {
      clerkId,
    },
  };
};

// init:
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// router:
export const createTRPCRouter = t.router;

// public:
export const publicProcedure = t.procedure;

// middlewares:
export const loggedInProcedure = publicProcedure
  .use(async ({ ctx, next }) => {
    const { clerkId } = ctx.self;

    if (!clerkId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No clerkId found",
      });
    }

    let user: User | undefined;

    try {
      user = await ctx.db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
      });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User retrieval by clerkId failed",
      })
    }

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No user found",
      });
    }

    return next({
      ctx: {
        ...ctx,
        self: {
          user
        },
      },
    });
  });

export const accessedProcedure = loggedInProcedure
  .input(z.object({
    accountId: z.string()
  }))
  .use(async ({ input, ctx, next }) => {
    const { id: userId } = ctx.self.user;
    const { accountId } = input;

    try {
      const membership = await ctx.db.query.memberships.findFirst({
        where: and(
          eq(memberships.userId, userId),
          eq(memberships.accountId, accountId)
        )
      });

      if (!membership) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No access found",
        });
      }

      return next({
        ctx: {
          ...ctx,
          accountId,
          self: {
            ...ctx.self,
            access: membership.access
          }
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Membership retrieval failed",
      })
    }
  });

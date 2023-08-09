import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";
import { db } from "~/server/db/db";
import { getAuth } from "@clerk/nextjs/server";
import { User, memberships, users } from "../db/schema";
import { and, eq } from "drizzle-orm";

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
      const role = await ctx.db.query.memberships.findFirst({
        where: and(
          eq(memberships.userId, userId),
          eq(memberships.accountId, accountId)
        )
      });

      if (!role) {
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
            access: role.access
          }
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Role retrieval failed",
      })
    }
  });

export const adminProcedure = accessedProcedure
  .use(async ({ ctx, next }) => {
    const { access } = ctx.self;
    if (access !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No admin access found",
      });
    }

    return next();
  });

export const userProcedure = adminProcedure
  .input(z.object({
    email: z.string().email()
  }))
  .use(async ({ input, ctx, next }) => {
    const { email } = input;

    let user: User | undefined = undefined;
    try {
      user = await ctx.db.query.users.findFirst({
        where: eq(users.email, email)
      });

    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User retrieval failed",
      })
    }

    let access: "admin" | "viewer" | "denied" = "denied";
    const { accountId } = ctx;

    if (user) {
      try {
        const role = await ctx.db.query.memberships.findFirst({
          where: and(
            eq(memberships.userId, user.id),
            eq(memberships.accountId, accountId)
          )
        })

        if (role) {
          access = role.access;
        }
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Access retrieval failed"
        })
      }
    }

    return next({
      ctx: {
        ...ctx,
        check: {
          access,
          user: user || null,
        },
      },
    })
  });

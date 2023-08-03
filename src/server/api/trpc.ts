import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Access } from "~/utils/types";
import superjson from "superjson";
import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";
import { db } from "~/server/db/db";
import { getAuth } from "@clerk/nextjs/server";
import { User, accountAdmins, accountViewers, users } from "../db/schema";
import { and, eq } from "drizzle-orm";

// context:
export const createTRPCContext = (opts: CreateNextContextOptions) => {
  const { req } = opts;
  const sesh = getAuth(req);

  const { userId: clerkId } = sesh;

  return {
    db,
    clerkId,
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
    const { clerkId } = ctx;
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
        clerkId,
        user,
      },
    });
  });

export const accessedProcedure = loggedInProcedure
  .input(z.object({
    accountId: z.string()
  }))
  .use(async ({ input, ctx, next }) => {
    const { user: { id: userId } } = ctx;
    const { accountId } = input;

    let access: Access | undefined;

    try {
      const admin = await ctx.db.query.accountAdmins.findFirst({
        where: and(
          eq(accountAdmins.adminId, userId),
          eq(accountAdmins.accountId, accountId)
        )
      });

      if (admin) {
        access = "admin";
      }
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Account admin retrieval failed",
      })
    }

    try {
      const viewer = await ctx.db.query.accountViewers.findFirst({
        where: and(
          eq(accountViewers.viewerId, userId),
          eq(accountViewers.accountId, accountId)
        )
      });
      if (viewer) {
        access = "viewer";
      }
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Account viewer retrieval failed",
      })
    }

    if (!access) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No access found",
      });
    }

    return next({
      ctx: {
        ...ctx,
        access,
        accountId,
      },
    });

  });

export const adminProcedure = accessedProcedure
  .use(async ({ ctx, next }) => {
    const { access } = ctx;
    if (access !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "No admin access found",
      });
    }

    return next();
  });

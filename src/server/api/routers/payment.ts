import type { Payment, NewPayment } from "~/server/db/schema";
import { z } from "zod";
import { accessedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { payments } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const eventRouter = createTRPCRouter({

});

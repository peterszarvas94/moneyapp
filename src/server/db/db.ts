import * as schema from '~/server/db/schema';
import { env } from '~/env.mjs';
import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { EventWithPayments } from '~/utils/types';
import { and, eq } from 'drizzle-orm';
import { events } from './schema';
import { TRPCError } from '@trpc/server';

const client = connect({
  // ssl is needed for planetscale, make sure to have '/?sslaccept=true' at the end
  url: env.DB_URL,
});

export const db = drizzle(client, { schema });

export async function getRemaining(eventId: string, accountId: string): Promise<number> {
  let event: EventWithPayments | undefined;
  try {
    event = await db.query.events.findFirst({
      where: and(
        eq(events.id, eventId),
        eq(events.accountId, accountId),
      ),
      with: {
        payments: true,
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Event retrieval failed",
    })
  }

  if (!event) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    })
  }

  const eventTotal = event.income - event.saving;
  const paymentExtraExpenses = event.payments.reduce((acc, payment) => acc + payment.extra, 0);

  const remaining = eventTotal - paymentExtraExpenses;
  return remaining;
}

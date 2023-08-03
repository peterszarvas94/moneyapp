import * as schema from '~/server/db/schema';
import { env } from '~/env.mjs';
import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const client = connect({
  // ssl is needed for planetscale, make sure to have '/?sslaccept=true' at the end
  url: env.DB_URL,
});

export const db = drizzle(client, {schema});

import type { Config } from 'drizzle-kit';
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: 'src/server/db/schema.ts',
  out: 'src/server/db/migrations',
  driver: "turso",
  dbCredentials: {
    url: process.env.DB_URL!,
    authToken: process.env.DB_TOKEN
  }
} satisfies Config;

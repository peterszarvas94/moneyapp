import type { Config } from 'drizzle-kit';
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: 'src/server/db/schema.ts',
  out: 'src/server/db/migrations',
  driver: "better-sqlite",
  dbCredentials: {
    url: 'sqlite.db'
  }
} satisfies Config;

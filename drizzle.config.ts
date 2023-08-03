import type { Config } from 'drizzle-kit';
import * as dotenv from "dotenv";
dotenv.config();

// local 'pscale connect' is needed first, local address for for drizzle-kit
export default {
  schema: "src/server/db/schema.ts",
  out: "src/server/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DB_LOCAL!,
  }
} satisfies Config;

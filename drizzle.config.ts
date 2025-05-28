import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.AWS_HOST!,
    user: process.env.AWS_USER!,
    password: process.env.AWS_PASSWORD!,
    database: process.env.AWS_DB_NAME!,
    port: Number(process.env.AWS_PORT!),
    ssl: { rejectUnauthorized: false }, // Matches your Pool configuration
  },
  verbose: true, // Provides more output during command execution
  strict: true, // Enables strict mode for more thorough checks
  schemaFilter: ["dev"],
});

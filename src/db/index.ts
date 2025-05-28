import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Determine schema based on environment
const schemaName = process.env.NODE_ENV === "production" ? "public" : "dev";

const pool = new Pool({
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  host: process.env.AWS_HOST,
  port: Number(process.env.AWS_PORT),
  database: process.env.AWS_DB_NAME,
  ssl: { rejectUnauthorized: false },
  // Set the search path to include our schema
  options: `-c search_path=${schemaName}`,
});

// Create drizzle instance with schema configuration
export const db = drizzle(pool, { schema });

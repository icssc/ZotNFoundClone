import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD,
  host: process.env.AWS_HOST,
  port: Number(process.env.AWS_PORT),
  database: process.env.AWS_DB_NAME,
  ssl: { rejectUnauthorized: false },
});
export const db = drizzle({ client: pool });

// const result = await db.execute("select * from dev.items");

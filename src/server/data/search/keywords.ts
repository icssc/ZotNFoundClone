"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function debugShowSearches() {
  const all = await db.select().from(searches);
  console.log("All searches:", all);
}

export async function fetchKeywords(email: string): Promise<string[]> {
  try {
    const result = await db.execute(
      sql`
        SELECT keyword
        FROM ${searches}
        WHERE ${email} = ANY(emails);
      `
    );

    return result.rows.map((row: any) => row.keyword);
  } catch (err) {
    throw err;
  }
}
import { db } from "@/db";
import { searches } from "@/db/schema";
import { or, sql } from "drizzle-orm";

export async function findEmailsCore(name: string, description: string) {
  const results = await db
    .select({ emails: searches.emails })
    .from(searches)
    .where(
      or(
        sql`${name} LIKE '%' || ${searches.keyword} || '%'`,
        sql`${description} LIKE '%' || ${searches.keyword} || '%'`
      )
    );
  return results.flatMap((r) => r.emails);
}

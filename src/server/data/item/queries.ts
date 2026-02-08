import "server-only";
import { db } from "@/db";
import { items, Item } from "@/db/schema";
import { ActionState } from "@/lib/types";
import { eq, or, isNull, and, gte } from "drizzle-orm";
import { connection } from "next/server";



export async function getAllItems(): Promise<ActionState<Item[]>> {
  try {
    await connection();

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const cutoffStr = twoYearsAgo.toISOString().slice(0, 10);

    const result = await db
      .select()
      .from(items)
      .where(
        and(
          or(eq(items.is_deleted, false), isNull(items.is_deleted)),
          gte(items.itemDate, cutoffStr)
        )
      );
    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

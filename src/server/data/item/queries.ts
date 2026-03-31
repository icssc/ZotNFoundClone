import "server-only";
import { db } from "@/db";
import { items, Item } from "@/db/schema";
import { ActionState } from "@/lib/types";
import { cacheTag } from "next/cache";
import { eq, or, isNull, and, gte, desc } from "drizzle-orm";
import { ITEMS_CACHE_TAG } from "./cache";

export async function getAllItems(): Promise<ActionState<Item[]>> {
  "use cache";
  cacheTag(ITEMS_CACHE_TAG);
  try {
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
      )
      .orderBy(desc(items.date), desc(items.id));
    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

import "server-only";
import { db } from "@/db";
import { items, Item } from "@/db/schema";
import { ActionState } from "@/lib/types";
import { eq, or, isNull, and, desc } from "drizzle-orm";

export async function getAllItems(): Promise<ActionState<Item[]>> {
  try {
    const result = await db
      .select()
      .from(items)
      .where(and(or(eq(items.is_deleted, false), isNull(items.is_deleted))))
      .orderBy(desc(items.date), desc(items.id))
      .limit(50);

    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

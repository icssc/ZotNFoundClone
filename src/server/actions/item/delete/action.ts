"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { Item, items } from "@/db/schema";
import type { ActionResult, ItemDeleteParams } from "@/lib/types";

export default async function deleteItem(
  params: ItemDeleteParams
): Promise<ActionResult<Item>> {
  const { itemId } = params;

  try {
    const [item] = await db
      .update(items)
      .set({ is_deleted: true })
      .where(eq(items.id, itemId))
      .returning();
    return { data: item };
  } catch (error) {
    return { error: `Error deleting item: ${error}` };
  }
}

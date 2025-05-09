"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { items, NewItem } from "@/db/schema";
import type { ActionResult, ItemUpdateParams } from "@/lib/types";

export default async function updateItem(
  params: ItemUpdateParams
): Promise<ActionResult<NewItem>> {
  const { itemId, isHelped, isResolved } = params;

  try {
    const [item] = await db
      .update(items)
      .set({ isresolved: isResolved, ishelped: isHelped })
      .where(eq(items.id, itemId))
      .returning();
    return { data: item };
  } catch (error) {
    console.error("Error updating item:", error);
    return {
      error: `Error updating item: ${error}`,
    };
  }
}

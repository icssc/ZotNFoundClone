"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { Item, items } from "@/db/schema";
import type { ActionResult, ItemUpdateParams, ItemEditParams } from "@/lib/types";

export default async function editItem(
  params: ItemEditParams
): Promise<ActionResult<Item>> {
  const { itemId, itemName, itemDescription, type, itemDate, image, location } = params;

  try {
    const [item] = await db
      .update(items)
      .set({name: itemName, description: itemDescription, type: type, itemDate: itemDate, image: image, location: []})
      .where(eq(items.id, itemId))
      .returning();
    return { data: item };
  } catch (error) {
    console.error("Error editing item:", error);
    return {
      error: `Error editing item: ${error}`,
    };
  }
}

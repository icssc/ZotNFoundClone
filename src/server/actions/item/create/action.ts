"use server";

import { db } from "@/db";
import { items, NewItem } from "@/db/schema";
import { ActionResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createItem(
  itemData: NewItem
): Promise<ActionResult<NewItem>> {
  try {
    const [newItem] = await db.insert(items).values(itemData).returning();
    revalidatePath("/");
    return { data: newItem };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Error adding item: ${msg}` };
  }
}

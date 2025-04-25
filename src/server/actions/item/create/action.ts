"use server";

import { db } from "@/db";
import { items, NewItem } from "@/db/schema";

export async function createItem(itemData: NewItem) {
  const [newItem] = await db.insert(items).values(itemData).returning();
  return newItem;
}

"use server";

import { db } from "@/db";
import { items, NewItem } from "@/db/schema";

export async function createItem(itemData: NewItem) {
  try {
    const [newItem] = await db.insert(items).values(itemData).returning();
    return newItem;
  } catch (error){
      if (error instanceof Error) {
        return {error: `Error adding item to database: ${error.message}`};
      } else {
        return {error: `Error adding item to database: ${String(error)}`};
      }
  }
}

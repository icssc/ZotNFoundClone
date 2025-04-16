import { db } from "@/db";
import { items } from "@/db/schema";
import { Item } from "@/db/schema";

export async function getAllItems(): Promise<Item[]> {
  try {
    const result = await db.select().from(items);
    return result;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}

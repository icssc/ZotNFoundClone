"use server";

import { db } from "@/db";
import { items } from "@/db/schema";
import { Item } from "@/db/schema";
import { eq } from 'drizzle-orm';



export async function getAllItems(): Promise<Item[]> {
  try {
    const result = await db.select().from(items);
    return result;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
}

export async function getItem(id: number): Promise<Item | undefined> {
  try {
    const result = await db.select().from(items).where(eq(items.id, id));
    return result[0];
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
}

export async function getItemEmail(id: number): Promise<string | null> {
  try {
    const result = await db
      .select({ email: items.email })
      .from(items)
      .where(eq(items.id, id));

    return result[0]?.email;
  } catch (error) {
    console.error("Error fetching item email:", error);
    throw error;
  }
}

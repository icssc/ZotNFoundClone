"use server";

import { db } from "@/db";
import { items, Item } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { ErrorResponse } from "@/lib/types";



export async function getAllItems(): Promise<Item[] | ErrorResponse> {
  try {
    const result = await db.select().from(items);
    return result;
  } catch (err) {
    return { error : `Error fetching item: ${err}`};
  }
}

export async function getItem(id: number): Promise<Item | ErrorResponse> {
  try {
    const result = await db.select().from(items).where(eq(items.id, id));

    if (result[0] === null || result[0] === undefined) {
      return {error: "Item not found for the given ID."};
    }

    return result[0];
  } catch (err) {
    return { error : `Error fetching item: ${err}`};
  }
}

export async function getItemEmail(id: number): Promise<string | ErrorResponse> {
  try {
    const result = await db
      .select({ email: items.email })
      .from(items)
      .where(eq(items.id, id));

    const email = result[0]?.email;
    
    if (email === null || email === undefined) {
      return { error : "Email not found for the given item ID."};
    }
    return email;
  } catch (err) {
    return { error : `Error fetching item: ${err}`};
  }
}

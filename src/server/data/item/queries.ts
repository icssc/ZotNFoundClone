"use server";

import { db } from "@/db";
import { items, Item } from "@/db/schema";
import { ActionResult } from "@/lib/types";
import { eq, or, isNull, and } from "drizzle-orm";
export async function getAllItems(): Promise<ActionResult<Item[]>> {
  "use cache";
  try {
    const result = await db
      .select()
      .from(items)
      .where(or(eq(items.is_deleted, false), isNull(items.is_deleted)));
    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

export async function getItem(id: number): Promise<ActionResult<Item>> {
  try {
    const [result] = await db
      .select()
      .from(items)
      .where(and(
        eq(items.id, id),
        or(eq(items.is_deleted, false), isNull(items.is_deleted))
      ))
      .limit(1);

    if (!result) {
      return { error: "Item not found for the given ID." };
    }

    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

export async function getItemEmail(id: number): Promise<ActionResult<string>> {
  try {
    const result = await db.query.items.findFirst({
      columns: {
        email: true,
      },
      where: eq(items.id, id),
    });

    if (!result) {
      return { error: "Item not found for the given ID." };
    }
    const email = result.email;
    if (!email) {
      return { error: "Email not found for the given item ID." };
    }
    return { data: email };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

export async function getTopFewItems(
  limit: number,
  offset: number
): Promise<ActionResult<Item[]>> {
  try {
    // Filter out deleted items (is_deleted is false or null)
    const result = await db
      .select()
      .from(items)
      .where(or(eq(items.is_deleted, false), isNull(items.is_deleted)))
      .limit(limit)
      .offset(offset);

    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

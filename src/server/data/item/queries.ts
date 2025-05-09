"use server";

import { db } from "@/db";
import { items, Item } from "@/db/schema";
import { ActionResult } from "@/lib/types";
import { eq } from "drizzle-orm";

export async function getAllItems(): Promise<ActionResult<Item[]>> {
  try {
    const result = await db.query.items.findMany();
    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

export async function getItem(id: number): Promise<ActionResult<Item>> {
  try {
    const result = await db.query.items.findFirst({
      where: eq(items.id, id),
    });

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

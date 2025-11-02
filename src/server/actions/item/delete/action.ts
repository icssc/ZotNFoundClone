"use server";

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { Item, items } from "@/db/schema";
import type { ActionResult, ItemDeleteParams } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export default async function deleteItem(
  params: ItemDeleteParams
): Promise<ActionResult<Item>> {
  const { itemId } = params;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return { error: "You must be signed in to delete an item." };
    }

    const userEmail = session.user.email;

    const [existingItem] = await db
      .select()
      .from(items)
      .where(and(eq(items.id, itemId), eq(items.email, userEmail)));

    if (!existingItem) {
      return { error: "Item not found or you don't have permission to delete it." };
    }

    if (existingItem.is_deleted) {
      return { error: "Item is already deleted." };
    }

    const [item] = await db
      .update(items)
      .set({ is_deleted: true })
      .where(and(eq(items.id, itemId), eq(items.email, userEmail)))
      .returning();

    revalidatePath("/");

    return { data: item };
  } catch (error) {
    return { error: `Error deleting item: ${error}` };
  }
}

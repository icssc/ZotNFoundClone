"use server";

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { items } from "@/db/schema";
import { createAction } from "@/server/actions/wrapper";
import { revalidatePath, revalidateTag } from "next/cache";
import { itemCacheTags } from "@/server/data/item/queries";
import { z } from "zod";

const deleteItemSchema = z.object({
  id: z.number(),
});

export const deleteItem = createAction(
  deleteItemSchema,
  async (data, session) => {
    const { id } = data;
    const userEmail = session.user.email;

    const [existingItem] = await db
      .select()
      .from(items)
      .where(and(eq(items.id, id), eq(items.email, userEmail)));

    if (!existingItem) {
      throw new Error(
        "Item not found or you don't have permission to delete it."
      );
    }

    if (existingItem.is_deleted) {
      throw new Error("Item is already deleted.");
    }

    const [item] = await db
      .update(items)
      .set({ is_deleted: true })
      .where(and(eq(items.id, id), eq(items.email, userEmail)))
      .returning();

    revalidatePath("/");
    revalidateTag(itemCacheTags.home, "seconds");
    revalidateTag(`${itemCacheTags.detailsPrefix}${id}`, "seconds");

    return item;
  }
);

"use server";

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { items } from "@/db/schema";
import { createAction } from "@/server/actions/wrapper";
import { z } from "zod";

const updateItemSchema = z.object({
  id: z.number(),
  isHelped: z.boolean().optional(),
  isResolved: z.boolean().optional(),
});

export const updateItem = createAction(
  updateItemSchema,
  async (data, session) => {
    const { id, isHelped, isResolved } = data;
    const userEmail = session.user.email;

    // Verify ownership
    const [existingItem] = await db
      .select()
      .from(items)
      .where(and(eq(items.id, id), eq(items.email, userEmail)));

    if (!existingItem) {
      throw new Error(
        "Item not found or you don't have permission to update it."
      );
    }

    const [item] = await db
      .update(items)
      .set({ isResolved: isResolved, isHelped: isHelped })
      .where(eq(items.id, id))
      .returning();
    return item;
  }
);

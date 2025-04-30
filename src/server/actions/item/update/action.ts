"use server"

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { items } from "@/db/schema";
import type { ItemUpdateParams } from "@/lib/types";

export default async function updateItem(params: ItemUpdateParams) {
	const { itemId, isHelped, isResolved } = params;

	try {
		const item = await db
			.update(items)
			.set({ isresolved: isResolved, ishelped: isHelped })
			.where(eq(items.id, itemId))
			.returning();
		return item;
	}
	catch (error) {
		console.error("Error updating item:", error);
		return null;
	}
}

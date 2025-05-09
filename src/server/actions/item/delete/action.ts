"use server"

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { items } from "@/db/schema";
import type { ItemDeleteParams } from "@/lib/types";

export default async function deleteItem(params: ItemDeleteParams) {
	const { itemId } = params;

	try {
		const item = await db
			.update(items)
			.set({ is_deleted: true })
			.where(eq(items.id, itemId))
			.returning();
		return item;
	}
	catch (error) {
		console.error("Error deleting item:", error);
		return null;
	}

}

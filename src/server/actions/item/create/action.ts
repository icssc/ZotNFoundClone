"use server";

import { db } from "@/db";
import { items, NewItem } from "@/db/schema";
import { type ItemPostParams } from "@/lib/types";

export async function createItem(itemData: ItemPostParams) {
  const { image, itemName, itemDescription, itemDate, islost } = itemData;

  const item: NewItem = {
    image: image,
    name: itemName,
    description: itemDescription,
    date: itemDate,
    islost: islost,
  };

  const [newItem] = await db.insert(items).values(item).returning();

  return newItem;
}

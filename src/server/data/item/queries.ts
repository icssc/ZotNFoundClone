"use cache";
import "server-only";
import { db } from "@/db";
import { items, Item } from "@/db/schema";
import { ActionState } from "@/lib/types";
import { eq, or, isNull, and, gte, desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import type { HomeItem } from "@/types/home";

const HOME_ITEMS_CACHE_TAG = "home-items";
const ITEM_DETAILS_TAG_PREFIX = "item-";

export async function getHomepageItems(): Promise<ActionState<HomeItem[]>> {
  "use cache";
  cacheLife({ stale: 120, revalidate: 30, expire: 3600 });
  cacheTag(HOME_ITEMS_CACHE_TAG);
  try {
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const cutoffStr = twoYearsAgo.toISOString().slice(0, 10);

    const result = await db
      .select({
        id: items.id,
        name: items.name,
        description: items.description,
        type: items.type,
        location: items.location,
        itemDate: items.itemDate,
        image: items.image,
        isLost: items.isLost,
        isResolved: items.isResolved,
        isHelped: items.isHelped,
      })
      .from(items)
      .where(
        and(
          or(eq(items.is_deleted, false), isNull(items.is_deleted)),
          gte(items.itemDate, cutoffStr)
        )
      )
      .orderBy(desc(items.date));
    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

export async function getItemDetailsById(
  id: number
): Promise<ActionState<Item>> {
  "use cache";
  cacheLife({ stale: 120, revalidate: 30, expire: 3600 });
  cacheTag(`${ITEM_DETAILS_TAG_PREFIX}${id}`);
  try {
    const [result] = await db
      .select()
      .from(items)
      .where(
        and(
          eq(items.id, id),
          or(eq(items.is_deleted, false), isNull(items.is_deleted))
        )
      )
      .limit(1);
    if (!result) {
      return { error: "Item not found" };
    }
    return { data: result };
  } catch (err) {
    return { error: `Error fetching item: ${err}` };
  }
}

export const itemCacheTags = {
  home: HOME_ITEMS_CACHE_TAG,
  detailsPrefix: ITEM_DETAILS_TAG_PREFIX,
};

import "server-only";
import { refresh, updateTag } from "next/cache";

export const ITEMS_CACHE_TAG = "items";

export function revalidateItems() {
  updateTag(ITEMS_CACHE_TAG);
  refresh();
}

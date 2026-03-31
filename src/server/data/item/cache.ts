import "server-only";
import { refresh } from "next/cache";

export function revalidateItems() {
  refresh();
}

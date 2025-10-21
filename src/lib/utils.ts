import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Item } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterItems(items: Item[], filter: string): Item[] {
  if (!filter) {
    return items;
  }
  const keyword: string = filter.toLowerCase();
  return items.filter(
    (item) =>
      item.name?.toLowerCase().includes(keyword) ||
      item.description?.toLowerCase().includes(keyword)
  );
}

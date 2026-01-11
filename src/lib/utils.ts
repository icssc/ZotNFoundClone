import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Item } from "@/db/schema";
import { z } from "zod";

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

export function formatPhoneNumber(n?: string): string {
  if (!n) return "";
  return n.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, "$1 ($2) $3-$4");
}

export function formatDate(dateString: string) {
  const yearMonthDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
  let date;
  if (dateString) {
    if (yearMonthDateSchema.safeParse(dateString).success) {
      const [year, month, day] = dateString.split("-").map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return "Unknown date";
}

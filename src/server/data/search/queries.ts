"use server";
import { ActionResult } from "./../../../lib/types";
import { db } from "@/db";
import { Search } from "@/db/schema";
import { eq } from "drizzle-orm";
import { items } from "@/db/schema";

export async function getAllSearches(): Promise<ActionResult<Search[]>> {
  try {
    const result = await db.query.searches.findMany();
    return { data: result };
  } catch (error) {
    console.error("Error fetching searches:", error);
    return { error: `Error fetching searches: ${error}` };
  }
}

export async function getItems(userEmail: string) {
  const results = await db
    .select({
      id: items.id,
      name: items.name,
      description: items.description,
      type: items.type,
      location: items.location,
      date: items.date,
      itemdate: items.itemdate,
      image: items.image,
      islost: items.islost,
      isresolved: items.isresolved,
      ishelped: items.ishelped,
      email: items.email,
    })
    .from(items)
    .where(eq(items.is_deleted, false));
  return results.map((item) => ({
    ...item,
    email: item.email === userEmail ? item.email : null,
  }))
}

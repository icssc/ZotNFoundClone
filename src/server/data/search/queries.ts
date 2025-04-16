import { db } from "@/db";
import { searches } from "@/db/schema";
import { Search } from "@/db/schema";

export async function getAllSearches(): Promise<Search[]> {
  try {
    const result = await db.select().from(searches);
    return result;
  } catch (error) {
    console.error("Error fetching searches:", error);
    throw error;
  }
}

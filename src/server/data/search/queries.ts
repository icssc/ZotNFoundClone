"use server";
import { ActionResult } from "./../../../lib/types";
import { db } from "@/db";
import { Search } from "@/db/schema";

export async function getAllSearches(): Promise<ActionResult<Search[]>> {
  try {
    const result = await db.query.searches.findMany();
    return { success: result };
  } catch (error) {
    console.error("Error fetching searches:", error);
    return { error: `Error fetching searches: ${error}` };
  }
}

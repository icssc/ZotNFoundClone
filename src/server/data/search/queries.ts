"use server";
import { ActionResult } from "./../../../lib/types";
import { db } from "@/db";
import { Search } from "@/db/schema";

export async function getAllSearches(): Promise<ActionResult<Search[]>> {
  try {
    const result = await db.query.searches.findMany();
    return { data: result };
  } catch (error) {
    console.error("Error fetching searches:", error);
    return { error: `Error fetching searches: ${error}` };
  }
}

export async function getKeywordsForUser(
  email: string
): Promise<ActionResult<string[]>> {
  try {
    // Query all searches and filter for ones containing the user's email
    const allSearches = await db.query.searches.findMany();
    
    // Filter searches where the user's email is in the emails array
    const userKeywords = allSearches
      .filter((search) => search.emails?.includes(email))
      .map((search) => search.keyword);

    return { data: userKeywords };
  } catch (error) {
    console.error("Error fetching user keywords:", error);
    return { error: `Error fetching user keywords: ${error}` };
  }
}

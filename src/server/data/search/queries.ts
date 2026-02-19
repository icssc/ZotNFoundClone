"use server";
import { ActionState } from "@/lib/types";
import { db } from "@/db";
import { trackServerError } from "@/lib/analytics-server";

export async function getKeywordsForUser(
  email: string
): Promise<ActionState<string[]>> {
  try {
    // Query all searches and filter for ones containing the user's email
    const allSearches = await db.query.searches.findMany();

    // Filter searches where the user's email is in the emails array
    const userKeywords = allSearches
      .filter((search) => search.emails?.includes(email))
      .map((search) => search.keyword);

    return { data: userKeywords };
  } catch (error) {
    trackServerError({
      error: error instanceof Error ? error.message : String(error),
      context: "Error fetching user keywords",
      stack: error instanceof Error ? error.stack : undefined,
      severity: "medium",
    });
    return { error: `Error fetching user keywords: ${error}` };
  }
}

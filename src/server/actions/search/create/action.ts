"use server";

import { db } from "@/db";
import { searches, Search } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ActionResult, isError, KeywordSubscription } from "@/lib/types";
import { findEmailsSubscribedToKeyword } from "@/server/actions/search/lookup/action";

export async function createKeywordSubscription(
  subscription: KeywordSubscription
): Promise<ActionResult<Search>> {
  const { keyword, email } = subscription;
  const lookup = await findEmailsSubscribedToKeyword(keyword);

  // If keyword not found, create a new row
  if (isError(lookup)) {
    // Check if it's a "not found" error or a real error
    if (lookup.error === "Keyword not found.") {
      // Keyword doesn't exist, create a new row
      try {
        const [result] = await db
          .insert(searches)
          .values({ keyword, emails: [email] })
          .returning();
        return { data: result };
      } catch (error) {
        return {
          error: `Error creating new keyword subscription: ${error}`,
        };
      }
    } else {
      // Real error occurred
      return { error: `Error fetching emails for keyword: ${lookup.error}` };
    }
  }

  const existingEmails = lookup.data.emails || [];
  if (existingEmails.includes(email)) {
    return { error: "You are already subscribed to this keyword." };
  }

  try {
    // Update existing keyword with new email
    const [result] = await db
      .update(searches)
      .set({ emails: [...existingEmails, email] })
      .where(eq(searches.keyword, keyword))
      .returning();

    return { data: result };
  } catch (error) {
    return {
      error: `Error updating subscriptions for keyword: ${error}`,
    };
  }
}

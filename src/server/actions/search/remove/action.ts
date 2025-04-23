"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { KeywordSubscription } from "@/lib/types";

export async function removeKeywordSubscription(
  subscription: KeywordSubscription
) {
  const { keyword, email } = subscription;

  try {
    // Retrieve emails associated with the given keyword from db | Can be empty if the keyword doesn't exist yet
    const emailsSubscribedToKeyword = await db.query.searches.findMany({
      columns: {
        emails: true,
      },
      where: eq(searches.keyword, keyword),
    });

    const existingEmails = emailsSubscribedToKeyword[0]?.emails ?? [];

    // If the keyword doesn't exist, return an error indicating so
    if (existingEmails.length === 0) {
      console.log("Keyword '" + keyword + "' does not exist");
      return { error: "Keyword '" + keyword + "' does not exist" };
    }

    try {
      // Unsubscribe user from keyword
      const [updatedSubscriptions] = await db
        .update(searches)
        .set({ emails: existingEmails.filter((e) => e !== email) })
        .where(eq(searches.keyword, keyword))
        .returning();

      console.log("UPDATED SUBSCRIPTIONS AFTER REMOVAL:", updatedSubscriptions);
      return { success: updatedSubscriptions };
    } catch (error) {
      return {
        error:
          "Cannot unsubscribe email '" +
          email +
          "' from keyword '" +
          keyword +
          "'",
      };
    }
  } catch (error) {
    return { error: "Could not retrieve emails for keyword '" + keyword + "'" };
  }
}

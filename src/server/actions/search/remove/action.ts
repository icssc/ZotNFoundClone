"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { KeywordSubscription } from "@/lib/types";

export async function removeKeywordSubscription(
  subscription: KeywordSubscription
) {
  const { keyword, email } = subscription;

  // Retrieve emails associated with the given keyword from db | Can be empty if the keyword doesn't exist yet
  const emailsSubscribedToKeyword = await db
    .select({ emails: searches.emails })
    .from(searches)
    .where(eq(searches.keyword, keyword));

  const existingEmails = emailsSubscribedToKeyword[0].emails ?? [];

  // Unsubscribe user from keyword
  const [updatedSubscriptions] = await db
    .update(searches)
    .set({ emails: existingEmails.filter((e) => e !== email) })
    .where(eq(searches.keyword, keyword))
    .returning();

  console.log("UPDATED SUBSCRIPTIONS AFTER REMOVAL:", updatedSubscriptions);
  return { success: updatedSubscriptions };
}

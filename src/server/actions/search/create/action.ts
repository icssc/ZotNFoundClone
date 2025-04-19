"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { KeywordSubscription } from "@/lib/types";

export async function createKeywordSubscription(subscription: KeywordSubscription) {
  const { keyword, email } = subscription;

  // Retrieve emails associated with the given keyword from db | Can be empty if the keyword doesn't exist yet
  const emailsSubscribedToKeyword = await db
    .select({ emails: searches.emails })
    .from(searches)
    .where(eq(searches.keyword, keyword));

  console.log("EMAILS SUBSCRIBED TO KEYWORD:", emailsSubscribedToKeyword);

  // Get the first result's emails array, or empty array if no results
  const existingEmails = emailsSubscribedToKeyword[0]?.emails ?? [];

  // Check if the email is already subscribed to the keyword
  if (existingEmails.includes(email)) {
    return { error: "You are already subscribed to this keyword." };
  }

  // keyword exists and email is not already subscribed atp, add email to existing keyword's list of emails
  if (emailsSubscribedToKeyword.length > 0) {
    const [updatedSubscriptions] = await db
      .update(searches)
      .set({ emails: [...existingEmails, email] })
      .where(eq(searches.keyword, keyword))
      .returning();

    console.log("UPDATED SUBSCRIPTIONS:", updatedSubscriptions);

    return { success: updatedSubscriptions };
  } else {
    // keyword does not exist, create new keyword and add email to it
    const [newKeyword] = await db
      .insert(searches)
      .values({
        keyword: keyword,
        emails: [email],
      })
      .returning();

    console.log("NEW KEYWORD:", newKeyword);

    return { success: newKeyword };
  }
}

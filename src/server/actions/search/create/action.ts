"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { KeywordSubscription } from "@/lib/types";
import { findEmailsSubscribedToKeyword } from "../lookup/action";

export async function createKeywordSubscription(
  subscription: KeywordSubscription
) {
  const { keyword, email } = subscription;
  let existingEmails: string[] = [];

  // Retrieve emails associated with the given keyword from db | Can be empty if the keyword doesn't exist yet
  const emailsSubscribedToKeyword = await findEmailsSubscribedToKeyword(
    keyword
  );

  // Get the first result's emails array, or empty array if no results
  if (emailsSubscribedToKeyword.success) {
    existingEmails = emailsSubscribedToKeyword.success.emails ?? [];
    console.log("EXISTING EMAILS (create):", existingEmails);
  }

  // Check if the email is already subscribed to the keyword
  if (existingEmails.includes(email)) {
    console.log("EMAIL ALREADY SUBSCRIBED (create):", email);
    return { error: "You are already subscribed to this keyword." };
  }

  // keyword exists and email is not already subscribed atp, add email to existing keyword's list of emails
  if (emailsSubscribedToKeyword.success) {
    const [updatedSubscriptions] = await db
      .update(searches)
      .set({ emails: [...existingEmails, email] })
      .where(eq(searches.keyword, keyword))
      .returning();

    console.log("UPDATED SUBSCRIPTIONS (create):", updatedSubscriptions);

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

    console.log("NEW KEYWORD (create):", newKeyword);

    return { success: newKeyword };
  }
}

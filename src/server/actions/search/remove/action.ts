"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { KeywordSubscription } from "@/lib/types";
import { findEmailsSubscribedToKeyword } from "../lookup/action";

export async function removeKeywordSubscription(
  subscription: KeywordSubscription
) {
  const { keyword, email } = subscription;
  let existingEmails: string[] = [];

  // Retrieve emails associated with the given keyword from db | Can be empty if the keyword doesn't exist yet
  const emailsSubscribedToKeyword = await findEmailsSubscribedToKeyword(
    keyword
  );

  if (emailsSubscribedToKeyword.success) {
    existingEmails = emailsSubscribedToKeyword.success.emails ?? [];
  }
  try {
    if (existingEmails.includes(email)) {
      // Unsubscribe user from keyword
      const [updatedSubscriptions] = await db
        .update(searches)
        .set({ emails: existingEmails.filter((e) => e !== email) })
        .where(eq(searches.keyword, keyword))
        .returning();

      console.log("UPDATED SUBSCRIPTIONS AFTER REMOVAL:", updatedSubscriptions);
      return { success: updatedSubscriptions };
    } else {
      console.log("EMAIL NOT SUBSCRIBED TO KEYWORD (remove):", email);
      return { error: "Email not subscribed to keyword: " + keyword };
    }
  } catch (error) {
    return { error: "Could not remove keyword subscription" };
  }
}

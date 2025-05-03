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

  if (isError(lookup)) {
    return { error: `Error fetching emails for keyword: ${lookup.error}` };
  }

  const existingEmails = lookup.success.emails || [];
  if (existingEmails.includes(email)) {
    return { error: "You are already subscribed to this keyword." };
  }

  try {
    const query =
      existingEmails.length > 0
        ? db
            .update(searches)
            .set({ emails: [...existingEmails, email] })
            .where(eq(searches.keyword, keyword))
            .returning()
        : db
            .insert(searches)
            .values({ keyword, emails: [email] })
            .returning();

    const [result] = await query;
    return { success: result };
  } catch (error) {
    return {
      error: existingEmails.length
        ? `Error updating subscriptions for keyword: ${error}`
        : `Error creating new keyword subscription: ${error}`,
    };
  }
}

"use server";

import { db } from "@/db";
import { searches, Search } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ActionResult, isError, KeywordSubscription } from "@/lib/types";
import { findEmailsSubscribedToKeyword } from "@/server/actions/search/lookup/action";

export async function removeKeywordSubscription(
  subscription: KeywordSubscription
): Promise<ActionResult<Search>> {
  const { keyword, email } = subscription;
  const lookup = await findEmailsSubscribedToKeyword(keyword);

  if (isError(lookup)) {
    return { error: `Error fetching emails for keyword: ${lookup.error}` };
  }

  const existingEmails = lookup.success.emails || [];
  if (!existingEmails.includes(email)) {
    return { error: "Email was not subscribed to this keyword." };
  }

  const updatedEmails = existingEmails.filter((e) => e !== email);

  try {
    const [result] = await db
      .update(searches)
      .set({ emails: updatedEmails })
      .where(eq(searches.keyword, keyword))
      .returning();

    return { success: result };
  } catch (error) {
    return { error: `Error removing subscription for keyword: ${error}` };
  }
}

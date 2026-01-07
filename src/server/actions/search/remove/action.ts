"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAction } from "@/server/actions/wrapper";
import { findEmailsSubscribedToKeyword } from "@/server/actions/search/lookup/action";
import { keywordSchema } from "@/server/actions/search/schema";

export const removeKeywordSubscription = createAction(
  keywordSchema,
  async (keyword, session) => {
    const email = session.user.email;

    const lookup = await findEmailsSubscribedToKeyword(keyword);
    if (!lookup.success) {
      throw new Error(
        lookup.error || "Failed to fetch existing subscriptions."
      );
    }

    const existingEmails = lookup.data?.emails ?? [];
    if (!existingEmails.includes(email)) {
      throw new Error("You are not subscribed to this keyword.");
    }

    const updatedEmails = existingEmails.filter((e: string) => e !== email);

    const [result] = await db
      .update(searches)
      .set({ emails: updatedEmails })
      .where(eq(searches.keyword, keyword))
      .returning();

    return result;
  }
);

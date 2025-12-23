"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAction } from "@/server/actions/wrapper";
import { findEmailsSubscribedToKeyword } from "@/server/actions/search/lookup/action";
import { keywordSchema } from "@/server/actions/search/schema";

export const createKeywordSubscription = createAction(
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
    if (existingEmails.includes(email)) {
      throw new Error("You are already subscribed to this keyword.");
    }

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
    return result;
  }
);

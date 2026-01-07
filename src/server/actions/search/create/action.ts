"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAction } from "@/server/actions/wrapper";
import { keywordSubscriptionSchema } from "@/server/actions/search/schema";
import { findEmailsSubscribedToKeyword } from "@/server/actions/search/lookup/action";

export const createKeywordSubscription = createAction(
  keywordSubscriptionSchema,
  async (data) => {
    const { keyword, email } = data;
    const lookup = await findEmailsSubscribedToKeyword(keyword);

    let existingEmails: string[] = [];

    if (!lookup.success) {
      if (lookup.error === "Keyword not found") {
        existingEmails = [];
      } else {
        throw new Error(`Error fetching emails for keyword: ${lookup.error}`);
      }
    } else {
      existingEmails = lookup.data?.emails || [];
    }

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

"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAction } from "@/server/actions/wrapper";
import { findEmailsSubscribedToKeywordsInFields } from "@/server/actions/search/lookup/action";
import { z } from "zod";

const keywordSubscriptionSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  email: z.email("Invalid email address"),
});

export const createKeywordSubscription = createAction(
  keywordSubscriptionSchema,
  async (data) => {
    const { keyword, email } = data;
    const lookup = await findEmailsSubscribedToKeywordsInFields(keyword);

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

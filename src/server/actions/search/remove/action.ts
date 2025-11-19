"use server";

import { db } from "@/db";
import { searches, Search } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAction } from "@/server/actions/wrapper";
import { findEmailsSubscribedToKeyword } from "@/server/actions/search/lookup/action";
import { z } from "zod";

const keywordSubscriptionSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  email: z.string().email("Invalid email address"),
});

export const removeKeywordSubscription = createAction(
  keywordSubscriptionSchema,
  async (data) => {
    const { keyword, email } = data;
    const lookup = await findEmailsSubscribedToKeyword(keyword);

    if (!lookup.success) {
      if (lookup.error === "Keyword not found") {
        throw new Error("Email was not subscribed to this keyword.");
      }
      throw new Error(`Error fetching emails for keyword: ${lookup.error}`);
    }

    const existingEmails = lookup.data?.emails || [];
    if (!existingEmails.includes(email)) {
      throw new Error("Email was not subscribed to this keyword.");
    }

    const updatedEmails = existingEmails.filter((e) => e !== email);

    const [result] = await db
      .update(searches)
      .set({ emails: updatedEmails })
      .where(eq(searches.keyword, keyword))
      .returning();

    return result;
  }
);

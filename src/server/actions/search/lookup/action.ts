"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { KeywordSubscription } from "@/lib/types";

export async function findEmailsSubscribedToKeyword(keyword: string) {
  try {
    const emailsSubscribedToKeyword = await db.query.searches.findMany({
      columns: {
        emails: true,
      },
      where: eq(searches.keyword, keyword),
    });
    console.log("EMAILS FOUND (lookup):", emailsSubscribedToKeyword[0]);
    return { success: emailsSubscribedToKeyword[0] };
  } catch (error) {
    return {
      error: "Keyword '" + keyword + "' not found",
    };
  }
}

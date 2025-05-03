"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ActionResult } from "@/lib/types";

export async function findEmailsSubscribedToKeyword(
  keyword: string
): Promise<ActionResult<{ emails: string[] | null }>> {
  try {
    const [emailsSubscribedToKeyword] = await db.query.searches.findMany({
      columns: {
        emails: true,
      },
      where: eq(searches.keyword, keyword),
    });
    if (!emailsSubscribedToKeyword) {
      return { error: "Keyword not found." };
    }
    return { success: emailsSubscribedToKeyword };
  } catch (error) {
    return {
      error: `Error fetching emails subscribed to keyword: ${error}`,
    };
  }
}

"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAction } from "@/server/actions/wrapper";
import { z } from "zod";

export const findEmailsSubscribedToKeyword = createAction(
  z.string(),
  async (keyword: string) => {
    const [emailsSubscribedToKeyword] = await db.query.searches.findMany({
      columns: {
        emails: true,
      },
      where: eq(searches.keyword, keyword),
    });
    if (!emailsSubscribedToKeyword) {
      // Return null or empty object if not found, or throw error?
      // Previous implementation returned error "Keyword not found."
      // But maybe we want to return null data?
      // Let's throw to return error in ActionState
      throw new Error("Keyword not found.");
    }
    return { emails: emailsSubscribedToKeyword.emails };
  }
);

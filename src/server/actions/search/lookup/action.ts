"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";
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
      throw new Error("Keyword not found.");
    }
    return { emails: emailsSubscribedToKeyword.emails };
  }
);

export const findEmailsSubscribedToKeywordsInFields = createAction(
  z.object({
    name: z.string(),
    description: z.string(),
  }),
  async ({ name, description }) => {
    const subscribedEmails = await db
      .select({ emails: searches.emails })
      .from(searches)
      .where(
        or(
          sql`${name} LIKE '%' || ${searches.keyword} || '%'`,
          sql`${description} LIKE '%' || ${searches.keyword} || '%'`
        )
      );

    const allEmails = subscribedEmails.flatMap((entry) => entry.emails);
    return { emails: Array.from(new Set(allEmails)) };
  }
);

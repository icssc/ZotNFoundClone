"use server";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createAction } from "@/server/actions/wrapper";
import { keywordSchema } from "@/server/actions/search/schema";

export const findEmailsSubscribedToKeyword = createAction(
  keywordSchema,
  async (keyword: string) => {
    const [emailsSubscribedToKeyword] = await db.query.searches.findMany({
      columns: {
        emails: true,
      },
      where: eq(searches.keyword, keyword),
    });

    if (!emailsSubscribedToKeyword) {
      return { emails: [] };
    }

    return { emails: emailsSubscribedToKeyword.emails };
  }
);

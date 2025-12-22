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
      throw new Error("Keyword not found.");
    }
    return { emails: emailsSubscribedToKeyword.emails };
  }
);

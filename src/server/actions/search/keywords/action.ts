"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { searches } from "@/db/schema";
import { createAction, type ActionState } from "@/server/actions/wrapper";
import { keywordSchema } from "@/server/actions/search/schema";
import { getKeywordsForUser } from "@/server/data/search/queries";

const noInputSchema = z.object({});

export type KeywordActionState = ActionState<string[] | undefined> & {
  data?: string[];
};

async function fetchUserKeywordsOrThrow(email: string) {
  const result = await getKeywordsForUser(email);
  if (result.error) {
    throw new Error(result.error);
  }
  return result.data ?? [];
}

const loadKeywords = createAction(noInputSchema, async (_, session) => {
  const email = session.user.email;
  return fetchUserKeywordsOrThrow(email);
});

const addKeyword = createAction(
  z.object({ keyword: keywordSchema }),
  async ({ keyword }, session) => {
    const email = session.user.email;

    const existing = await db.query.searches.findFirst({
      columns: { emails: true },
      where: eq(searches.keyword, keyword),
    });

    const existingEmails = existing?.emails ?? [];
    if (existingEmails.includes(email)) {
      return fetchUserKeywordsOrThrow(email);
    }

    if (existing) {
      await db
        .update(searches)
        .set({ emails: [...existingEmails, email] })
        .where(eq(searches.keyword, keyword));
    } else {
      await db.insert(searches).values({ keyword, emails: [email] });
    }

    revalidatePath("/");
    return fetchUserKeywordsOrThrow(email);
  }
);

const removeKeyword = createAction(
  z.object({ keyword: keywordSchema }),
  async ({ keyword }, session) => {
    const email = session.user.email;

    const existing = await db.query.searches.findFirst({
      columns: { emails: true },
      where: eq(searches.keyword, keyword),
    });

    const existingEmails = existing?.emails ?? [];
    if (!existing || !existingEmails.includes(email)) {
      throw new Error("You are not subscribed to this keyword.");
    }

    const updatedEmails = existingEmails.filter((e) => e !== email);

    await db
      .update(searches)
      .set({ emails: updatedEmails })
      .where(eq(searches.keyword, keyword));

    revalidatePath("/");
    return fetchUserKeywordsOrThrow(email);
  }
);

export async function keywordFormAction(
  prevState: KeywordActionState,
  formData: FormData
): Promise<KeywordActionState> {
  const intent = String(formData.get("intent") || "load");
  const rawKeyword = formData.get("keyword");
  const parsedKeyword =
    typeof rawKeyword === "string" ? keywordSchema.safeParse(rawKeyword) : null;
  const keyword = parsedKeyword?.success ? parsedKeyword.data : undefined;

  const normalizeError = (message: string): KeywordActionState => ({
    success: false,
    error: message,
    data: prevState.data ?? [],
  });

  try {
    switch (intent) {
      case "load":
        return loadKeywords({});

      case "add":
        if (!keyword) {
          return normalizeError("Keyword is required to add a subscription.");
        }
        return addKeyword({ keyword });

      case "remove":
        if (!keyword) {
          return normalizeError(
            "Keyword is required to remove a subscription."
          );
        }
        return removeKeyword({ keyword });

      default:
        return normalizeError("Invalid keyword intent.");
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error handling keyword action",
      data: prevState.data ?? [],
    };
  }
}

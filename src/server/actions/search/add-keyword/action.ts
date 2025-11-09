"use server";

import { createKeywordSubscription } from "@/server/actions/search/create/action";
import { ActionResult, KeywordSubscription } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addKeyword(keyword: string): Promise<ActionResult<void>> {
  try {
    // Get the current session to get the user's email
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return { error: "You must be signed in to add keywords." };
    }

    if (!keyword || keyword.trim().length === 0) {
      return { error: "Keyword cannot be empty." };
    }

    const userEmail = session.user.email;
    const subscription: KeywordSubscription = {
      keyword: keyword.trim().toLowerCase(),
      email: userEmail,
    };

    const result = await createKeywordSubscription(subscription);

    if ("error" in result) {
      return { error: result.error };
    }

    revalidatePath("/");
    return { data: undefined };
  } catch (error) {
    return {
      error: `Error adding keyword: ${error}`,
    };
  }
}

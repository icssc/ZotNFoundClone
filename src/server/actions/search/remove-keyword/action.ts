"use server";

import { removeKeywordSubscription } from "@/server/actions/search/remove/action";
import { ActionResult, KeywordSubscription } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function removeKeyword(keyword: string): Promise<ActionResult<void>> {
  try {
    // Get the current session to get the user's email
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return { error: "You must be signed in to remove keywords." };
    }

    const userEmail = session.user.email;
    const subscription: KeywordSubscription = {
      keyword: keyword.trim().toLowerCase(),
      email: userEmail,
    };

    const result = await removeKeywordSubscription(subscription);
    
    if ("error" in result) {
      return { error: result.error };
    }

    revalidatePath("/");
    return { data: undefined };
  } catch (error) {
    return {
      error: `Error removing keyword: ${error}`,
    };
  }
}


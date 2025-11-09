"use server";

import { getKeywordsForUser } from "@/server/data/search/queries";
import { ActionResult } from "@/lib/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserKeywords(): Promise<ActionResult<string[]>> {
  try {
    // Get the current session to get the user's email
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return { error: "You must be signed in to view your bookmarks." };
    }

    const userEmail = session.user.email;
    return await getKeywordsForUser(userEmail);
  } catch (error) {
    return {
      error: `Error fetching user keywords: ${error}`,
    };
  }
}


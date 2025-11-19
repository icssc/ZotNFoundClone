"use server";
import { db } from "@/db";
import { ActionState } from "@/lib/types";
import { Leaderboard, leaderboard } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getLeaderboard(): Promise<ActionState<Leaderboard[]>> {
  try {
    const result = await db
      .select()
      .from(leaderboard)
      .orderBy(desc(leaderboard.points));

    return { data: result };
  } catch (error) {
    return { error: `Error fetching leaderboard: ${error}` };
  }
}

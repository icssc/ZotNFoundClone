"use server";
import { ActionResult } from "@/lib/types";
import { db } from "@/db";
import { leaderboard, Leaderboard } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getAllLeaderboard(): Promise<
  ActionResult<Leaderboard[]>
> {
  try {
    const result = await db.query.leaderboard.findMany({
      orderBy: [desc(leaderboard.points)],
    });
    return { data: result };
  } catch (error) {
    return { error: `Error fetching leaderboard: ${error}` };
  }
}

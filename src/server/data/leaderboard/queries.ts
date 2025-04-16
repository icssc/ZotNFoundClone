import { db } from "@/db";
import { leaderboard } from "@/db/schema";
import { Leaderboard } from "@/db/schema";

export async function getAllLeaderboard(): Promise<Leaderboard[]> {
  try {
    const result = await db.select().from(leaderboard);
    return result;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

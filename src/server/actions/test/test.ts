"use server";

import { db } from "@/db";

export async function TestAction() {
  const result = await db.execute("select * from dev.items");
  console.log(result);
}

"use server";

import { db } from "@/db";
import { items } from "@/db/schema";

export async function TestAction() {
  const result = await db.select().from(items);
  console.log(result);
}

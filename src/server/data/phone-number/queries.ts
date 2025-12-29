"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { phoneVerifications } from "@/db/schema";

export async function getPendingVerificationInfoByEmail(email: string) {
  const [pendingVerification] = await db
    .select()
    .from(phoneVerifications)
    .where(eq(phoneVerifications.email, email));
  return pendingVerification;
}

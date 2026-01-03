"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { db } from "@/db";
import { user } from "@/db/auth-schema";
import { phoneVerifications } from "@/db/schema";
import { createAction } from "@/server/actions/wrapper";

export const removePhoneNumber = createAction(
  z.object({
    target: z.enum(["verified", "unverified"]),
  }),
  async ({ target }, session) => {
    const email = session.user.email;

    if (target === "verified") {
      await db
        .update(user)
        .set({ phoneNumber: null, verifiedAt: null })
        .where(eq(user.email, email));
    } else {
      await db
        .delete(phoneVerifications)
        .where(eq(phoneVerifications.email, email));
    }
    revalidatePath("/settings");
    return { phoneNumber: "", isVerified: false, verificationPending: false };
  }
);

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { db } from "@/db";
import { emailToNumber, phoneVerifications } from "@/db/schema";
import { createAction } from "@/server/actions/wrapper";

export const removePhoneNumber = createAction(
  z.object({
    target: z.enum(["verified", "unverified"]),
  }),
  async ({ target }, session) => {
    const email = session.user.email;

    if (target === "verified") {
      await db.delete(emailToNumber).where(eq(emailToNumber.email, email));
    } else {
      await db
        .delete(phoneVerifications)
        .where(eq(phoneVerifications.email, email));
    }
    revalidatePath("/settings");
    return { phoneNumber: "", isVerified: false, verificationPending: false };
  }
);

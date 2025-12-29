"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { db } from "@/db";
import { emailToNumber, phoneVerifications } from "@/db/schema";
import { createAction } from "@/server/actions/wrapper";

export const removeVerifiedNumber = createAction(
  z.object({}),
  async (_, session) => {
    const email = session.user.email;
    await db.delete(emailToNumber).where(eq(emailToNumber.email, email));
    revalidatePath("/settings");
    return { phoneNumber: "", isVerified: false, verificationPending: false };
  }
);

export const removeUnverifiedNumber = createAction(
  z.object({}),
  async (_, session) => {
    const email = session.user.email;
    await db
      .delete(phoneVerifications)
      .where(eq(phoneVerifications.email, email));
    revalidatePath("/settings");
    return { phoneNumber: "", isVerified: false, verificationPending: false };
  }
);
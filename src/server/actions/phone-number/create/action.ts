"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import z from "zod";
import { db } from "@/db";
import { phoneVerifications } from "@/db/schema";
import { sendSMS } from "@/lib/sms/service";
import { createAction } from "@/server/actions/wrapper";

const phoneSchema = z.string().regex(/^\+1\d{10}$/);

export const addPhoneNumberToVerify = createAction(
  z.object({ newNumber: phoneSchema }),
  async ({ newNumber }, session) => {
    const email = session.user.email;
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 3);
    const expiresAt = currentTime.toISOString();

    try {
      await sendSMS(
        `Your verification code to confirm that you'd like to receive found item posting alerts at ${newNumber} is ${verificationCode}.`,
        newNumber
      );
    } catch (error) {
      throw new Error(
        "Failed to send verification code to " +
          newNumber +
          ". Please try adding a different phone number to receive alerts."
      );
    }
    await db.insert(phoneVerifications).values({
      email,
      phoneNumber: newNumber,
      attemptsLeft: 3,
      expiresAt,
      verificationCode,
    });
    revalidatePath("/settings");
    return {
      phoneNumber: newNumber,
      isVerified: false,
      verificationPending: true,
    };
  }
);

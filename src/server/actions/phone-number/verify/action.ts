import crypto from "crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import { db } from "@/db";
import { emailToNumber, phoneVerifications } from "@/db/schema";
import { sendSMS } from "@/lib/sms/service";
import { createAction } from "@/server/actions/wrapper";

export const resendVerificationCode = createAction(
  z.object({}),
  async ({}, session) => {
    const email = session.user.email;
    const [pendingVerification] = await db
      .select({ phoneNumber: phoneVerifications.phoneNumber })
      .from(phoneVerifications)
      .where(eq(phoneVerifications.email, email));
    if (!pendingVerification) {
      throw new Error("No phone number to verify. Please add a phone number.");
    }

    const newNumber = pendingVerification.phoneNumber;
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
      console.log(error);
      throw new Error(
        "Failed to send verification code to " +
          newNumber +
          ". Please try adding a different phone number to receive alerts."
      );
    }
    await db
      .update(phoneVerifications)
      .set({
        attemptsLeft: 3,
        expiresAt,
        verificationCode,
      })
      .where(eq(phoneVerifications.email, email));
    revalidatePath("/settings");
    return {
      phoneNumber: newNumber,
      isVerified: false,
      verificationPending: true,
    };
  }
);

export const verifyCode = createAction(
  z.object({ code: z.string() }),
  async ({ code }, session) => {
    const email = session.user.email;
    const [pendingVerification] = await db
      .select()
      .from(phoneVerifications)
      .where(eq(phoneVerifications.email, email));
    if (!pendingVerification) {
      // no code to verify against
      throw new Error(
        "There was an error validating your code. Please request a new code or change your phone number."
      );
    }
    const now = new Date();
    const expiresAt = new Date(pendingVerification.expiresAt);
    if (now > expiresAt) {
      throw new Error(
        "This code has expired. Please request a new code or change your phone number."
      );
    }
    if (pendingVerification.attemptsLeft <= 0) {
      throw new Error(
        "You have exceeded the maximum number of attempts. Please request a new code or change your phone number."
      );
    }
    if (pendingVerification.verificationCode !== code) {
      const newAttempts = pendingVerification.attemptsLeft - 1;
      await db
        .update(phoneVerifications)
        .set({ attemptsLeft: newAttempts })
        .where(eq(phoneVerifications.email, email));
      if (newAttempts <= 0) {
        throw new Error(
          "Incorrect code. You have no attempts left. Please request a new code or change your phone number."
        );
      }
      throw new Error(
        `Incorrect code. You have ${newAttempts === 2 ? "2 attempts" : "1 attempt"} remaining.`
      );
    }

    await db.transaction(async (tx) => {
      await tx.insert(emailToNumber).values({
        email,
        phoneNumber: pendingVerification.phoneNumber,
      });
      await tx
        .delete(phoneVerifications)
        .where(eq(phoneVerifications.email, email));
    });

    revalidatePath("/settings");

    return {
      phoneNumber: pendingVerification.phoneNumber,
      isVerified: true,
      verificationPending: false,
    };
  }
);

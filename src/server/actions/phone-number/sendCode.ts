import crypto from "crypto";
import { sendSMS } from "@/lib/sms/service";
import { trackError } from "@/lib/analytics";

export default async function sendVerificationCodeBySMS(
  newNumber: string
): Promise<{
  expiresAt: string;
  verificationCode: string;
}> {
  const verificationCode = crypto.randomInt(100000, 1000000).toString();
  const currentTime = new Date();
  currentTime.setMinutes(currentTime.getMinutes() + 3);
  const expiresAt = currentTime.toISOString();
  try {
    await sendSMS(
      `Your verification code to confirm that you'd like to receive found item posting alerts at ${newNumber} is ${verificationCode}.`,
      newNumber
    );
  } catch (error: any) {
    console.error("Failed to send verification code.");
    trackError({
      error: error?.name || "Unknown error",
      context: "Failure sending phone number verification code",
    });
    throw new Error(
      "Failed to send verification code to " +
        newNumber +
        ". Please try adding a different phone number to receive alerts."
    );
  }
  return { expiresAt, verificationCode };
}

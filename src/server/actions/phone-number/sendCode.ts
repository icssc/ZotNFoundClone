import { sendSMS } from "@/lib/sms/service";

export default async function sendVerificationCodeBySMS(
  newNumber: string,
  verificationCode: string
) {
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
}

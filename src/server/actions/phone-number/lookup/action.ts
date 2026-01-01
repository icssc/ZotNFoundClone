"server only";

import z from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { emailToNumber, phoneVerifications } from "@/db/schema";
import { createAction } from "@/server/actions/wrapper";

async function getVerifiedPhoneNumber(email: string) {
  const existing = await db.query.emailToNumber.findFirst({
    columns: { phoneNumber: true },
    where: eq(emailToNumber.email, email),
  });
  const verifiedNum = existing?.phoneNumber ?? "";
  return {
    phoneNumber: verifiedNum,
    isVerified: Boolean(verifiedNum),
    verificationPending: false,
  };
}

async function getPhoneNumberPendingVerification(email: string) {
  const existing = await db.query.phoneVerifications.findFirst({
    columns: { phoneNumber: true },
    where: eq(phoneVerifications.email, email),
  });
  const pendingNum = existing?.phoneNumber ?? "";
  return {
    phoneNumber: pendingNum,
    isVerified: false,
    verificationPending: Boolean(pendingNum),
  };
}

export const findPhoneNumber = createAction(
  z.object({}),
  async (_, session) => {
    const email = session.user.email;
    const result = await getVerifiedPhoneNumber(email);
    if (result.phoneNumber) {
      return result;
    }
    return await getPhoneNumberPendingVerification(email);
  }
);

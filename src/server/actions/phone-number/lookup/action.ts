"server only";

import z from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { emailToNumber, phoneVerifications } from "@/db/schema";
import { createAction } from "@/server/actions/wrapper";

async function getPhoneNumber(verified: boolean, email: string) {
  let existing;
  if (verified) {
    existing = await db.query.emailToNumber.findFirst({
      columns: { phoneNumber: true },
      where: eq(emailToNumber.email, email),
    });
  } else {
    existing = await db.query.phoneVerifications.findFirst({
      columns: { phoneNumber: true },
      where: eq(phoneVerifications.email, email),
    });
  }
  return existing?.phoneNumber ?? "";
}

export const findPhoneNumber = createAction(
  z.object({}),
  async (_, session) => {
    const email = session.user.email;
    const verifiedNum = await getPhoneNumber(true, email);
    if (verifiedNum) {
      return {
        phoneNumber: verifiedNum,
        isVerified: true,
        verificationPending: false,
      };
    }
    const pendingNum = await getPhoneNumber(false, email);
    return {
      phoneNumber: pendingNum,
      isVerified: false,
      verificationPending: Boolean(pendingNum),
    };
  }
);

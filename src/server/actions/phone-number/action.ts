"use server";

import { type PhoneIntent } from "@/lib/types";
import { phoneIntents } from "@/lib/sms/constants";
import { addPhoneNumberToVerify } from "@/server/actions/phone-number/create/action";
import { removePhoneNumber } from "@/server/actions/phone-number/delete/action";
import {
  resendVerificationCode,
  verifyCode,
} from "@/server/actions/phone-number/verify/action";
import type { PhoneNumberActionState } from "@/server/actions/phone-number/shared";

export async function phoneNumberFormAction(
  prevState: PhoneNumberActionState,
  formData: FormData
): Promise<PhoneNumberActionState> {
  const intent = formData.get("intent") as PhoneIntent;
  const phoneNumber = String(formData.get("phoneNumber") ?? "");
  const verificationCode = String(formData.get("verificationCode") ?? "");
  let result;

  try {
    switch (intent) {
      case phoneIntents.ADD:
        result = await addPhoneNumberToVerify({ newNumber: phoneNumber });
        break;
      case phoneIntents.REMOVE:
        result = await removePhoneNumber("verified");
        break;
      case phoneIntents.VERIFY:
        result = await verifyCode({ code: verificationCode });
        break;
      case phoneIntents.RESEND:
        result = await resendVerificationCode({});
        break;
      case phoneIntents.CHANGE:
        result = await removePhoneNumber("unverified");
        break;
      default:
        throw new Error(`Unhandled intent: ${intent satisfies never}`);
    }

    if (result?.success) {
      return result;
    }

    return {
      success: false,
      error: result?.error || "Invalid intent.",
      prevState: prevState.success ? prevState.data : prevState.prevState,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error when handling phone number action",
      prevState: prevState.data,
    };
  }
}

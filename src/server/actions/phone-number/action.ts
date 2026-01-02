"use server";

import { type PhoneIntent } from "@/lib/types";
import { phoneIntents } from "@/lib/constants";
import { type ActionState } from "@/server/actions/wrapper";
import { findPhoneNumber } from "@/server/actions/phone-number/lookup/action";
import { addPhoneNumberToVerify } from "@/server/actions/phone-number/create/action";
import {
  resendVerificationCode,
  verifyCode,
} from "@/server/actions/phone-number/verify/action";
import {
  removeVerifiedNumber,
  removeUnverifiedNumber,
} from "@/server/actions/phone-number/delete/action";

type PhoneStatus = {
  phoneNumber: string;
  isVerified: boolean;
  verificationPending: boolean;
};

export type PhoneNumberActionState = ActionState<PhoneStatus> & {
  data?: PhoneStatus;
  prevState?: PhoneStatus;
};

export async function phoneNumberFormAction(
  prevState: PhoneNumberActionState,
  formData: FormData
): Promise<PhoneNumberActionState> {
  const intent = formData.get("intent") as PhoneIntent;
  const num = formData.get("phoneNumber") || "";
  const verificationCode = formData.get("verificationCode") || "";
  let result;
  try {
    switch (intent) {
      case phoneIntents.LOAD:
        result = await findPhoneNumber({});
        break;
      case phoneIntents.ADD:
        result = await addPhoneNumberToVerify({ newNumber: num });
        break;
      case phoneIntents.REMOVE:
        result = await removeVerifiedNumber({});
        break;
      case phoneIntents.VERIFY:
        result = await verifyCode({ code: verificationCode });
        break;
      case phoneIntents.RESEND:
        result = await resendVerificationCode({});
        break;
      case phoneIntents.CHANGE:
        result = await removeUnverifiedNumber({});
        break;
      default:
        const _otherIntent: never = intent;
        throw new Error(`Unhandled intent: ${intent}`);
    }
    if (result && result.success) {
      return result;
    }
    return {
      success: false,
      error: result?.error || "Invalid intent.",
      prevState: prevState.success ? prevState?.data : prevState?.prevState,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error when handling phone number action",
      prevState: prevState?.data,
    };
  }
}

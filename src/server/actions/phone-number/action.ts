"use server";

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
  const intent = formData.get("intent") || "";
  const num = formData.get("phoneNumber") || "";
  const verificationCode = formData.get("verificationCode") || "";
  let result;
  try {
    if (intent === "load_phone") {
      result = await findPhoneNumber({});
    } else if (intent === "add_phone") {
      result = await addPhoneNumberToVerify({ newNumber: num });
    } else if (intent === "remove_phone") {
      result = await removeVerifiedNumber({});
    } else if (intent === "verify_phone") {
      result = await verifyCode({ code: verificationCode });
    } else if (intent === "resend_code") {
      result = await resendVerificationCode({});
    } else if (intent === "change_number") {
      result = await removeUnverifiedNumber({});
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

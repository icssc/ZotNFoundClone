import type { ActionState } from "@/server/actions/wrapper";

export type PhoneStatus = {
  phoneNumber: string;
  isVerified: boolean;
  verificationPending: boolean;
};

export type PhoneNumberActionState = ActionState<PhoneStatus> & {
  data?: PhoneStatus;
  prevState?: PhoneStatus;
};

export function createPhoneStatus(
  phoneNumber: string,
  isVerified: boolean,
  verificationPending: boolean
): PhoneStatus {
  return {
    phoneNumber,
    isVerified,
    verificationPending,
  };
}

"use client";

import UnverifiedView from "@/components/PhoneNumberForm/UnverifiedView";
import VerifiedView from "@/components/PhoneNumberForm/VerifiedView";
import { useActionState } from "react";
import {
  phoneNumberFormAction,
  type PhoneNumberActionState,
} from "@/server/actions/phone-number/action";

function formatPhoneNumber(number: string | undefined) {
  if (!number) {
    return "";
  }
  return number?.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, "$1 ($2) $3-$4");
}

export default function PhoneNumberForm({
  initialSettings,
}: {
  initialSettings: PhoneNumberActionState;
}) {
  const [state, formAction, isPending] = useActionState<
    PhoneNumberActionState,
    FormData
  >(phoneNumberFormAction, initialSettings);

  const {
    phoneNumber: unformattedPhoneNumber,
    isVerified,
    verificationPending,
  } = state.success ? state.data : state?.prevState || {};
  const phoneNumber = formatPhoneNumber(unformattedPhoneNumber);

  return (
    <div className="space-y-2 px-20">
      <h4 className="text-xl font-medium">SMS Alerts</h4>
      {isVerified ? (
        <VerifiedView
          phoneNumber={phoneNumber}
          formAction={formAction}
          isPending={isPending}
        />
      ) : (
        <UnverifiedView
          formAction={formAction}
          isPending={isPending}
          phoneNumber={phoneNumber}
          verificationPending={verificationPending}
        />
      )}

      {!state.success && state.error && (
        <p className="text-sm text-red-400">
          {state.error === "Validation failed"
            ? "Phone number must be a valid US number (+1XXXXXXXXXX)."
            : state.error}
        </p>
      )}
    </div>
  );
}

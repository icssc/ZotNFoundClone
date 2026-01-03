"use client";
import { useActionState } from "react";
import VerifiedView from "./VerifiedView";
import UnverifiedView from "./UnverifiedView";
import { formatPhoneNumber } from "@/lib/utils";
import {
  phoneNumberFormAction,
  type PhoneNumberActionState,
} from "@/server/actions/phone-number/action";

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
    phoneNumber: raw,
    isVerified,
    verificationPending,
  } = state.success ? state.data : state.prevState || {};
  const phoneNumber = formatPhoneNumber(raw);

  const common: {
    formAction: (payload: FormData) => void;
    isPending: boolean;
  } = { formAction, isPending };

  return (
    <div className="space-y-2 px-20">
      <h4 className="text-xl font-medium">SMS Alerts</h4>
      {isVerified ? (
        <VerifiedView {...common} phoneNumber={phoneNumber} />
      ) : (
        <UnverifiedView
          {...common}
          phoneNumber={phoneNumber || ""}
          verificationPending={verificationPending}
        />
      )}
      {!state.success && state.error && <ErrorMsg error={state.error} />}
    </div>
  );
}

function ErrorMsg({ error }: { error: string }) {
  return (
    <p className="text-sm text-red-400">
      {error === "Validation failed"
        ? "Phone number must be a valid US number (+1XXXXXXXXXX)."
        : error}
    </p>
  );
}

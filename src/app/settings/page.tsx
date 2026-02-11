import SettingsClient from "@/components/SettingsClient";
import { findPhoneNumber } from "@/server/actions/phone-number/lookup/action";
import type { PhoneNumberActionState } from "@/server/actions/phone-number/action";
import { Suspense } from "react";

async function SettingsContent() {
  const userSettings = await findPhoneNumber({});
  const initialSettings: PhoneNumberActionState =
    userSettings?.success === true
      ? userSettings
      : {
          success: false,
          error: userSettings?.error ?? "Unauthorized",
          data: undefined,
          prevState: undefined,
        };

  return (
    <div className="p-4 md:p-6">
      <SettingsClient initialSettings={initialSettings} />
    </div>
  );
}

function SettingsLoading() {
  return (
    <div className="p-4 md:p-6">
      <div className="text-sm text-muted-foreground">Loading settings...</div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  );
}

import SettingsClient from "@/components/SettingsClient";
import { findPhoneNumber } from "@/server/actions/phone-number/lookup/action";
import type { PhoneNumberActionState } from "@/server/actions/phone-number/action";
import { Suspense } from "react";

async function SettingsData() {
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

  return <SettingsClient initialSettings={initialSettings} />;
}

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <Suspense
        fallback={
          <div className="rounded-lg border border-white/5 bg-black/40 p-6 text-sm text-white/70">
            Loading settings...
          </div>
        }
      >
        <SettingsData />
      </Suspense>
    </div>
  );
}

import SettingsClient from "@/components/SettingsClient";
import { findPhoneNumber } from "@/server/actions/phone-number/lookup/action";
import type { PhoneNumberActionState } from "@/server/actions/phone-number/shared";
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
      <div className="w-full space-y-6 animate-pulse">
        <header className="flex flex-col gap-2 p-2 md:p-3">
          <div className="h-4 w-20 rounded-full bg-white/10" />
          <div className="h-8 w-56 rounded-full bg-white/10" />
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
          <section className="rounded-xl space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-5 w-36 rounded-full bg-white/10" />
                <div className="h-4 w-52 rounded-full bg-white/10" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8 space-y-5">
            <div className="h-6 w-40 rounded-full bg-white/10" />
            <div className="h-4 w-full rounded-full bg-white/10" />
            <div className="h-12 w-full rounded-xl bg-white/10" />
            <div className="h-10 w-32 rounded-full bg-white/10" />
          </section>
        </div>
      </div>
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

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PhoneNumberForm from "@/components/PhoneNumberForm/PhoneNumberForm";
import { useSharedContext } from "@/components/ContextProvider";
import { handleSignIn } from "@/lib/auth-client";
import { trackError } from "@/lib/analytics";
import type { User } from "better-auth";
import type { PhoneNumberActionState } from "@/server/actions/phone-number/action";

type SettingsClientProps = {
  initialSettings: PhoneNumberActionState;
};

function ProfileAvatar({ user }: { user?: User }) {
  if (user?.image) {
    return (
      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/10">
        <Image
          src={user.image}
          alt={user.name || "Profile"}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-full bg-indigo-500/80 border border-white/10 flex items-center justify-center text-lg font-semibold text-white">
      {user?.name?.[0]?.toUpperCase() || "U"}
    </div>
  );
}

export default function SettingsClient({
  initialSettings,
}: SettingsClientProps) {
  const { user, signOut } = useSharedContext();
  const router = useRouter();

  const onSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (err) {
      trackError({
        error: err instanceof Error ? err.message : "Unknown error",
        context: "SettingsClient sign out",
        severity: "medium",
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <header className="flex flex-col gap-2 p-2 md:p-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">
              Settings
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-white">
              Account & Alerts
            </h1>
          </div>
          {user ? (
            <Button
              variant="ghost"
              onClick={onSignOut}
              className="rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              Sign Out
            </Button>
          ) : null}
        </div>
      </header>

      {user ? (
        <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
          <section className="rounded-xl space-y-3">
            <div className="flex items-center gap-4">
              <ProfileAvatar user={user} />
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">
                  {user.name || "Unnamed User"}
                </p>
                <p className="text-sm text-white/70">
                  {user.email || "No email on file"}
                </p>
              </div>
            </div>
          </section>

          <section className="p-0">
            <PhoneNumberForm initialSettings={initialSettings} />
          </section>
        </div>
      ) : (
        <section className="rounded-2xl bg-black/20 p-6 md:p-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-2xl font-semibold">
            🔒
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Sign in to manage your settings
          </h2>
          <p className="text-white/70 max-w-md mx-auto">
            Log in to view your profile, manage notification preferences, and
            update your contact details.
          </p>
          <div className="flex justify-center">
            <Button
              variant="default"
              onClick={handleSignIn}
              className="rounded-full px-6 bg-white text-black hover:bg-gray-200"
            >
              Log in
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

import PhoneNumberForm from "@/components/PhoneNumberForm/PhoneNumberForm";
import { findPhoneNumber } from "@/server/actions/phone-number/lookup/action";

export default async function SettingsPage() {
  let userSettings;
  try {
    userSettings = await findPhoneNumber({});
  } catch (error) {
    return (
      <div className="text-center min-h-screen space-y-8 bg-black text-white selection:bg-blue-500/30">
        <div className="mx-4 md:mx-32 py-8 space-y-8">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p>You must be signed in to view your settings.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4">
      <PhoneNumberForm initialSettings={userSettings} />
    </div>
  );
}

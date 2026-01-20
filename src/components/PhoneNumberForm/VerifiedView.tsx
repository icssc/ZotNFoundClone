import { Phone } from "lucide-react";
import SubmitButton from "@/components/ui/submit-button";
import { phoneIntents } from "@/lib/sms/constants";

export default function VerifiedView({
  phoneNumber,
  formAction,
  isPending,
}: {
  phoneNumber?: string;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}) {
  return (
    <>
      <p className="text-sm text-white/60 leading-relaxed">
        You will be notified via SMS when items matching your search keywords
        are found.
      </p>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-lg bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Phone className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-emerald-300">
              Verified number
            </span>
            <span className="text-sm text-white/80">{phoneNumber}</span>
          </div>
        </div>
        <form action={formAction} className="self-start md:self-auto">
          <SubmitButton
            isPending={isPending}
            name="intent"
            value={phoneIntents.REMOVE}
            variant="ghost"
            size="sm"
            className="text-red-200 hover:text-red-100 hover:bg-red-400/10"
          >
            Remove
          </SubmitButton>
        </form>
      </div>
    </>
  );
}

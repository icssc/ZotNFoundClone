import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/submit-button";
import { phoneIntents } from "@/lib/sms/constants";

export default function UnverifiedView({
  formAction,
  isPending,
  verificationPending,
  phoneNumber,
}: {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  verificationPending?: boolean;
  phoneNumber: string;
}) {
  const pending = verificationPending;
  return (
    <>
      <p className="text-sm text-white/60 leading-relaxed">
        Add and verify your phone to get SMS alerts when items matching your
        keywords are found.
      </p>
      {pending && (
        <p className="text-sm text-white/60 leading-relaxed">
          Enter the verification code sent to{" "}
          <span className="font-semibold text-white">{phoneNumber}</span>. Codes
          expire after 3 minutes.
        </p>
      )}
      <form action={formAction} className="space-y-3 rounded-lg bg-white/5 p-4">
        <div className="flex items-center gap-2">
          <Input
            name={pending ? "verificationCode" : "phoneNumber"}
            type={pending ? "text" : "tel"}
            placeholder={pending ? "123456" : "+19491234567"}
            className="flex-1 bg-black/40 border-white/15 text-white placeholder:text-white/40"
            disabled={isPending}
          />
          <SubmitButton
            isPending={isPending}
            type="submit"
            name="intent"
            value={pending ? phoneIntents.VERIFY : phoneIntents.ADD}
          >
            {pending ? "Verify" : "Add Phone Number"}
          </SubmitButton>
        </div>

        {pending && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              name="intent"
              value={phoneIntents.RESEND}
              disabled={isPending}
              className="text-xs text-white/60 hover:text-white/80"
            >
              <RefreshCcw className="mr-2 h-3 w-3" />
              Send a new code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              name="intent"
              value={phoneIntents.CHANGE}
              disabled={isPending}
              className="text-xs text-white/60 hover:text-white/80"
            >
              <ArrowLeft className="mr-2 h-3 w-3" />
              Change number
            </Button>
          </div>
        )}
      </form>
    </>
  );
}

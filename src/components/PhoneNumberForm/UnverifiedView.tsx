import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/submit-button";
import { phoneIntents } from "@/lib/constants";

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
      <p className="text-gray-400 text-sm leading-relaxed">
        To get SMS alerts when items matching your search keywords are found,
        add and verify your phone number.
      </p>
      {pending && (
        <p className="text-sm leading-relaxed">
          Verify {phoneNumber} by inputting the verification code sent via SMS.
          The code expires three minutes after it is sent.
        </p>
      )}
      <form action={formAction} className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            name={pending ? "verificationCode" : "phoneNumber"}
            type={pending ? "text" : "tel"}
            placeholder={pending ? "123456" : "+19491234567"}
            className="flex-1"
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
              className="text-xs text-muted-foreground"
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
              className="text-xs text-muted-foreground"
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

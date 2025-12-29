import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/PhoneNumberForm/SubmitButton";

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
  const formConfig = verificationPending
    ? {
        inputName: "verificationCode",
        inputType: "text",
        placeholder: "123456",
        submitLabel: "Verify",
        submitIntent: "verify_phone",
      }
    : {
        inputName: "phoneNumber",
        inputType: "tel",
        placeholder: "+19491234567",
        submitLabel: "Add Phone Number",
        submitIntent: "add_phone",
      };

  return (
    <>
      <p className="text-gray-400 text-sm leading-relaxed">
        To get SMS alerts when items matching your search keywords are found,
        add and verify your phone number.
      </p>
      {verificationPending && (
        <p className="text-sm leading-relaxed">
          Verify {phoneNumber} by inputting the verification code sent via SMS.
          The code expires three minutes after it is sent.
        </p>
      )}
      <form action={formAction} className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            name={formConfig.inputName}
            type={formConfig.inputType}
            placeholder={formConfig.placeholder}
            className="flex-1"
            disabled={isPending}
          />
          <SubmitButton
            isPending={isPending}
            type="submit"
            name="intent"
            value={formConfig.submitIntent}
          >
            {formConfig.submitLabel}
          </SubmitButton>
        </div>

        {/* Additional options once an unverified phone number exists */}
        {verificationPending && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              name="intent"
              value="resend_code"
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
              value="change_number"
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

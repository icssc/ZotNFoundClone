import { Phone } from "lucide-react";
import SubmitButton from "@/components/PhoneNumberForm/SubmitButton";

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
      <p className="text-gray-400 text-sm">
        You will be notified via SMS when items matching your search keywords
        are found.
      </p>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100/10">
            <Phone className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex flex-row">
            <span className="text-xs text-green-500 px-2">
              Verified phone number:
            </span>
            <span className="text-xs">{phoneNumber}</span>
          </div>
        </div>
        <form action={formAction}>
          <SubmitButton
            isPending={isPending}
            name="intent"
            value="remove_phone"
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            Delete
          </SubmitButton>
        </form>
      </div>
    </>
  );
}

import { Button } from "@/components/ui/button";
import type { User } from "better-auth";
import { Check, Share2 } from "lucide-react";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

interface ContactSectionProps {
  user: User | null;
  copied: boolean;
  showConfirm: boolean;
  state: ContactState;
  isPending: boolean;
  isSubmitDisabled: boolean;
  onShowConfirmChange: (show: boolean) => void;
  onCopyLink: () => void;
  onSignIn: () => void;
  formAction: (payload: FormData) => void;
}

export function ContactSection({
  user,
  copied,
  showConfirm,
  state,
  isPending,
  isSubmitDisabled,
  onShowConfirmChange,
  onCopyLink,
  onSignIn,
  formAction,
}: ContactSectionProps) {
  // Unsigned user view
  if (!user) {
    return (
      <div className="flex flex-col gap-3 pt-2 text-sm">
        <p className="text-gray-400">
          Sign in with your UCI email to contact the owner directly from
          ZotNFound.
        </p>
        <div className="flex gap-2 w-full flex-col">
          <Button
            variant="default"
            className="bg-white/5 hover:bg-white/10 text-white w-full"
            onClick={onSignIn}
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCopyLink}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </Button>
        </div>
      </div>
    );
  }

  // Confirmation form view
  if (user && showConfirm) {
    return (
      <form action={formAction} className="space-y-3 pt-2 text-sm">
        <p>
          Notify the owner and CC your email{" "}
          <span className="font-medium text-white">({user.email})</span>?
        </p>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitDisabled}
            className="min-w-24"
          >
            {isPending
              ? "Sending..."
              : state.status === "success"
                ? "Sent"
                : "Send"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={() => onShowConfirmChange(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  // Idle signed-in view returns nothing (actions handled by ActionFooter)
  return null;
}

export default ContactSection;

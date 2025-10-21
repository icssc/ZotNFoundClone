"use client";
import { useActionState, useState } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { User, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLostObject } from "@/lib/types";
import { Item } from "@/db/schema";
import { signInWithGoogle } from "@/lib/auth-client";
import { toast } from "sonner";
import { User as UserType } from "better-auth";

type ContactState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

function DetailedDialog({ item, user }: { item: Item, user: UserType | null }) {
  const islostObject = isLostObject(item);

  const [showConfirm, setShowConfirm] = useState(false);

  const contactAction = async (): Promise<ContactState> => {
    if (!user) {
      toast.error("Please sign in first.");
      return { status: "error", message: "Not authenticated." };
    }

    try {
      const res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: {
            id: item.id,
            name: item.name,
            type: item.type,
            email: item.email,
            image: item.image,
            description: item.description,
            itemDate: item.itemDate,
          },
          finderName: user.name || "Anonymous",
          finderEmail: user.email,
        }),
      });

      if (res.ok) {
        toast.success("Owner notified successfully!");
        return { status: "success", message: "Owner notified." };
      }

      const json = await res.json().catch(() => null);
      const errorMessage = json?.error || "Failed to send notification.";
      toast.error(errorMessage);
      return { status: "error", message: errorMessage };
    } catch {
      toast.error("Network error. Please try again.");
      return { status: "error", message: "Network error." };
    }
  };

  const initialState: ContactState = { status: "idle", message: null };
  const [state, formAction, isPending] = useActionState(
    contactAction,
    initialState
  );

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Failed to sign in. Please try again and check your Wi-fi.");
    }
  };

  const handleContactClick = () => {
    if (!user) {
      toast.info("Sign in with your UCI email to contact the owner.");
    } else {
      setShowConfirm(true);
    }
  };

  const isSubmitDisabled = isPending || state.status === "success";

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{item.name}</DialogTitle>
        <DialogDescription>
          {islostObject ? "Lost" : "Found"} item details
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Owner Email</p>
            <p className="text-sm text-gray-500">{item.email}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-sm text-gray-500">{item.date}</p>
            <p className="text-sm text-gray-500">
              Status: {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-500">
              {Array.isArray(item.location)
                ? item.location.join(", ")
                : item.location || "No location provided"}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="font-medium">Description</p>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        </div>

        {!user && (
          <div className="flex flex-col gap-3 pt-2 text-sm">
            <p className="text-gray-400">
              Sign in with your UCI email to contact the owner.
            </p>
            <Button variant="default" onClick={handleSignIn}>
              Sign In
            </Button>
          </div>
        )}

        {user && showConfirm && (
          <form action={formAction} className="space-y-3 pt-2 text-sm">
            <p>Notify the owner and CC your email ({user.email})?</p>
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitDisabled}
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
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {user && !showConfirm && (
          <Button
            variant="outline"
            onClick={handleContactClick}
            disabled={isPending}
          >
            Contact
          </Button>
        )}
        {!user && (
          <Button variant="outline" onClick={handleContactClick}>
            Contact
          </Button>
        )}
      </div>
    </DialogContent>
  );
}

export { DetailedDialog };

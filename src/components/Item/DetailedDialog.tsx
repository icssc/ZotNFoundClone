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
import Image from "next/image";
import { signInWithGoogle } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSharedContext } from "../ContextProvider";

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

type ContactState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

function DetailedDialog({ item }: { item: Item }) {
  const islostObject = isLostObject(item);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useSharedContext();
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
    <DialogContent className="w-[calc(100%-2rem)] max-w-md bg-black/95 border-white/20 text-white p-0 max-h-[90vh] overflow-y-auto">
      <div className="mt-10 px-4 sm:px-6">
        <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-md bg-white/10 border border-white/20 backdrop-blur-sm">
          <Image
            src={
              item.image && isValidUrl(item.image)
                ? item.image
                : "/placeholder.jpg"
            }
            alt={item.name || "Item Image"}
            fill
            sizes="(max-width: 640px) 100vw, 448px"
            style={{ objectFit: "contain" }}
            loading="lazy"
            priority={false}
            preload={false}
            fetchPriority="low"
            className="bg-black"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black/80 pointer-events-none" />
        </div>
      </div>
      <div className="px-4 sm:px-6">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-white text-left truncate text-base sm:text-lg">
                {item.name}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-left text-xs sm:text-sm italic underline">
                {islostObject ? "Lost" : "Found"} item details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
      </div>

      <div className="space-y-3 sm:space-y-4 py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md bg-white/1 hover:bg-white/5 transition-all duration-200">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm sm:text-base">
              Contact
            </p>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              {item.email}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md bg-white/1 hover:bg-white/5 transition-all duration-200">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm sm:text-base">
              Date & Status
            </p>
            <p className="text-xs sm:text-sm text-gray-400">{item.date}</p>
            <p className="text-xs sm:text-sm text-gray-400">
              Status: {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md bg-white/1 hover:bg-white/5 transition-all duration-200">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm sm:text-base">
              Location
            </p>
            <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
              {item.location || "No location provided"}
            </p>
          </div>
        </div>

        <div className="pt-2 p-2 sm:p-3 rounded-md bg-white/2 hover:bg-white/5">
          <p className="font-medium text-white mb-2 text-sm sm:text-base">
            Description
          </p>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {item.description}
          </p>
        </div>

        {!user && (
          <div className="flex flex-col gap-3 pt-2 text-sm">
            <p className="text-gray-400">
              Sign in with your UCI email to contact the owner directly from ZotNFound.
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

      {user && !showConfirm && (
        <div className="flex justify-end gap-2 pt-2 sm:pt-3 pb-4 sm:pb-6 px-4 sm:px-6 border-t border-white/10">
          <Button
            variant="outline"
            className="bg-black hover:bg-white/10 border-white/30 text-white hover:text-white transition-all duration-200 hover:scale-105 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
            onClick={handleContactClick}
            disabled={isPending}
          >
            Contact
          </Button>
        </div>
      )}
    </DialogContent>
  );
}

export { DetailedDialog };

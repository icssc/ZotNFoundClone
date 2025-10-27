"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isLostObject } from "@/lib/types";
import { Item } from "@/db/schema";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Mail, Share2, Check } from "lucide-react";
import { z } from "zod";

import { signInWithGoogle } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSharedContext } from "../ContextProvider";

function DetailedDialog({ item }: { item: Item }) {
  const islostObject = isLostObject(item);

  // Minimal UI state
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useSharedContext();

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/?item=${item.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // reset after 2s
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Unable to copy link to clipboard.");
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const handleContact = async () => {
    if (!user) {
      // If not signed in, nudge to sign in.
      toast.info("Sign in with your UCI email to contact the owner.");
      return;
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
        return;
      }

      const json = await res.json().catch(() => null);
      const errorMessage = json?.error || "Failed to send notification.";
      toast.error(errorMessage);
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
      <div className="flex flex-col sm:flex-row gap-4 my-8">
        {/* Image - Top on mobile, Left on desktop */}
        <div className="w-full max-w-sm sm:w-64 h-80 sm:h-64 relative mx-auto sm:mx-8">
          <Image
            src={
              z.url().safeParse(item.image).success
                ? item.image
                : "/placeholder.jpg"
            }
            alt={item.name || "Item Image"}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 640px) 100vw, 256px"
          />
        </div>

        {/* Content - Bottom on mobile, Right on desktop */}
        <div className="min-w-76 flex flex-col justify-between px-4 sm:px-0">
          <DialogHeader className="text-left pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {item.name}
            </DialogTitle>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  islostObject
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {islostObject ? "Lost" : "Found"}
              </span>
              <span className="text-sm text-gray-500">
                Posted:{" "}
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </DialogHeader>

          <Separator />

          <div className="space-y-3 mt-4">
            <div>
              <p className="font-semibold text-gray-900 mb-2 text-sm">
                Description:
              </p>
              <div className="text-xs space-y-1">
                <p className="text-gray-500">
                  {islostObject ? "Lost on" : "Found on"}{" "}
                  {new Date(item.itemDate).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
                {item.description && <p className="mt-2">{item.description}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {/* Contact button: when signed out, it should match Sign In button background.
                When signed in, make it outline (so it visually differs). */}
            <div className="relative">
              <Button
                onClick={handleContact}
                className={`flex items-center gap-2 w-full sm:w-40 ${
                  !user
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-blue-600 text-blue-600 hover:text-blue-700"
                }`}
                variant={user ? "outline" : "default"}
              >
                <Mail className="h-4 w-4" />
                Contact
              </Button>
            </div>

            {/* Copy Link button next to Contact */}
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-40 border-blue-600 text-blue-600 hover:text-blue-700"
              onClick={handleShare}
            >
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {isCopied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export { DetailedDialog };

"use client";

import { useActionState, useState } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLostObject } from "@/lib/types";
import { Item } from "@/db/schema";
import Image from "next/image";
import { toast } from "sonner";
import { useSharedContext } from "../ContextProvider";
import { z } from "zod";
import { deleteItem } from "@/server/actions/item/delete/action";
import { updateItem } from "@/server/actions/item/update/action";
import { useRouter } from "next/navigation";
import { handleSignIn } from "@/lib/auth-client";
import {
  trackItemContactAttempt,
  trackItemContactSuccess,
  trackItemShareLink,
  trackItemDeleted,
  trackItemResolved,
  trackItemHelped,
  trackEditItemDialogOpened,
} from "@/lib/analytics";
import ContactSection from "./detail/ContactSection";
import StatusSection from "./detail/StatusSection";
import ActionFooter from "./detail/ActionFooter";
import dynamic from "next/dynamic";

const ItemWizardDialog = dynamic(
  () => import("./ItemWizardDialog").then((mod) => mod.ItemWizardDialog),
  { ssr: false }
);

type ContactState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

function DetailedDialog({ item }: { item: Item }) {
  const islostObject = isLostObject(item);
  const { user } = useSharedContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const isOwner = user?.email === item.email;

  const contactAction = async (): Promise<ContactState> => {
    if (!user) {
      toast.error("Please sign in first.");
      return { status: "error", message: "Not authenticated." };
    }

    try {
      // Track contact attempt
      trackItemContactAttempt({
        itemId: String(item.id),
        itemType: item.type || "unknown",
        isLost: islostObject,
      });

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
        // Track successful contact
        trackItemContactSuccess({
          itemId: String(item.id),
          itemType: item.type || "unknown",
          isLost: islostObject,
        });
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

  const handleContactClick = () => {
    if (!user) {
      toast.info("Sign in with your UCI email to contact the owner.");
    } else {
      setShowConfirm(true);
    }
  };

  const handleCopy = async () => {
    try {
      const shareUrl = `${window.location.origin}/?item=${item.id}`;
      await navigator.clipboard.writeText(shareUrl);

      trackItemShareLink({
        itemId: String(item.id),
        itemType: item.type || "unknown",
        isLost: islostObject,
      });

      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      trackItemDeleted({
        itemId: String(item.id),
        itemType: item.type || "unknown",
        isLost: islostObject,
      });

      const result = await deleteItem({ id: item.id });

      if (!result.success) {
        toast.error(result.error || "Failed to delete item");
      } else {
        toast.success("Item deleted successfully");
        const url = new URL(window.location.href);
        url.searchParams.delete("item");
        window.history.replaceState({}, "", url.toString());
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isSubmitDisabled = isPending || state.status === "success";

  const handleEditClick = () => {
    trackEditItemDialogOpened({
      itemId: String(item.id),
      itemType: item.type || "unknown",
    });
    setShowEditDialog(true);
  };

  const handleToggleResolved = async () => {
    if (islostObject) return; // not applicable
    setIsUpdating(true);
    const nextResolved = !item.isResolved;
    try {
      const result = await updateItem({
        id: item.id,
        isResolved: nextResolved,
        isHelped: item.isHelped ?? false,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to update item");
      } else {
        if (nextResolved) {
          trackItemResolved({
            itemId: String(item.id),
            itemType: item.type || "unknown",
            isLost: islostObject,
          });
          toast.success("Item marked as resolved!");
        } else {
          toast.success("Item marked as unresolved.");
        }
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update item. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleHelped = async () => {
    if (!islostObject) return; // not applicable
    setIsUpdating(true);
    const nextHelped = !item.isHelped;
    try {
      const result = await updateItem({
        id: item.id,
        isResolved: item.isResolved ?? false,
        isHelped: nextHelped,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to update item");
      } else {
        if (nextHelped) {
          trackItemHelped({
            itemId: String(item.id),
            itemType: item.type || "unknown",
            isLost: islostObject,
          });
          toast.success("Item marked as helped!");
        } else {
          toast.success("Item marked as unhelp.");
        }
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update item. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md bg-black/95 border-white/20 text-white p-0 pb-3 flex flex-col max-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Image */}
        <div className="pt-10 px-4 sm:px-6">
          <div className="relative w-full h-56 sm:h-72 overflow-hidden rounded-md bg-white/10 border border-white/20 backdrop-blur-sm">
            <Image
              src={
                z.url().safeParse(item.image).success
                  ? item.image
                  : "/placeholder.jpg"
              }
              alt={item.name || "Item Image"}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              style={{ objectFit: "contain" }}
              className="bg-black"
              loading="lazy"
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
              </div>
            </div>
          </DialogHeader>
        </div>
        <div className="space-y-3 sm:space-y-4 px-4 sm:px-6">
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

          <StatusSection item={item} isLost={islostObject} />

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

          <ContactSection
            user={user ?? null}
            copied={copied}
            showConfirm={showConfirm}
            state={state}
            isPending={isPending}
            isSubmitDisabled={isSubmitDisabled}
            onShowConfirmChange={setShowConfirm}
            onCopyLink={handleCopy}
            onSignIn={handleSignIn}
            formAction={formAction}
          />

          {isOwner && showDeleteConfirm && (
            <div className="space-y-3 text-sm border-t border-white/20 mt-4 pt-4">
              <p className="text-red-400 font-medium">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {user && !showConfirm && !showDeleteConfirm && (
          <div className="px-4 sm:px-6 border-t border-white/20 pt-3 mt-2">
            <ActionFooter
              item={item}
              user={user}
              isLost={islostObject}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              copied={copied}
              onEdit={handleEditClick}
              onToggleHelped={handleToggleHelped}
              onToggleResolved={handleToggleResolved}
              onDeleteConfirm={() => setShowDeleteConfirm(true)}
              onCopyLink={handleCopy}
              onContact={handleContactClick}
              contactDisabled={isPending || state.status === "success"}
            />
          </div>
        )}
      </DialogContent>

      {isOwner && (
        <ItemWizardDialog
          mode="edit"
          item={item}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
}

export { DetailedDialog };

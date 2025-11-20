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
import { formatLocationDisplay } from "@/lib/types";
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
          toast.success("Item marked as unhelped.");
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
      <DialogContent className="w-[95%] bg-black/50 border-white/10 text-white p-0 pb-3 flex flex-col max-h-[calc(100vh-4rem)] overflow-y-auto backdrop-blur-xl shadow-2xl animate-in-fade">
        {/* Image Section with Gradient Overlay */}
        <div className="relative w-full h-72 sm:h-80 shrink-0">
          <Image
            src={
              z.url().safeParse(item.image).success
                ? item.image
                : "/dark_placeholder.jpg"
            }
            alt={item.name || "Item Image"}
            fill
            sizes="(max-width: 640px) 80vw, 448px"
            style={{ objectFit: "cover" }}
            className="bg-zinc-900"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none" />

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pt-12">
            <DialogHeader>
              <DialogTitle className="text-white text-left font-bold text-2xl sm:text-3xl tracking-tight drop-shadow-md animate-in-slide-up">
                {item.name}
              </DialogTitle>
            </DialogHeader>
          </div>
        </div>

        <div className="space-y-4 px-6 -mt-2 relative z-10">
          {/* Status Badge */}
          <div className="flex justify-start">
            <StatusSection item={item} isLost={islostObject} />
          </div>

          {/* Info Grid */}
          <div className="grid gap-3">
            {/* Contact Info */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
              <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <User className="h-5 w-5 text-white/80" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white/60 text-xs uppercase tracking-wider">
                  Contact
                </p>
                <p className="text-sm sm:text-base text-white font-medium truncate">
                  {item.email}
                </p>
              </div>
            </div>

            {/* Location Info */}
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
              <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <MapPin className="h-5 w-5 text-white/80" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white/60 text-xs uppercase tracking-wider">
                  Location
                </p>
                <p className="text-sm sm:text-base text-white font-medium break-words">
                  {formatLocationDisplay(item.location)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300">
            <p className="font-medium text-white/60 text-xs uppercase tracking-wider mb-2">
              Description
            </p>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-wrap">
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
            <div className="space-y-3 text-sm border-t border-white/10 mt-4 pt-4 animate-in-fade">
              <p className="text-red-400 font-medium text-center">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isDeleting}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-white/5 hover:bg-white/10 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="bg-red-600/80 hover:bg-red-600 text-white"
                >
                  {isDeleting ? "Deleting..." : "Delete Item"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {user && !showConfirm && !showDeleteConfirm && (
          <div className="px-6 pt-4 pb-2 mt-auto">
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

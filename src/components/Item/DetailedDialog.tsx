"use client";

import { useActionState, useReducer } from "react";
import { DialogContent } from "@/components/ui/dialog";
import { isLostObject } from "@/lib/types";
import { Item } from "@/db/schema";
import { toast } from "sonner";
import { useSharedContext } from "../ContextProvider";
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
import { ContactSection, ContactState } from "./detail/ContactSection";
import { StatusSection } from "./detail/StatusSection";
import { ActionFooter } from "./detail/ActionFooter";
import { DetailHeader } from "./detail/DetailHeader";
import { DetailInfoGrid } from "./detail/DetailInfoGrid";
import { DetailDescription } from "./detail/DetailDescription";
import { DeleteConfirmSection } from "./detail/DeleteConfirmSection";
import dynamic from "next/dynamic";

const ItemWizardDialog = dynamic(
  () => import("./ItemWizardDialog").then((mod) => mod.ItemWizardDialog),
  { ssr: false }
);

type UiState = {
  showConfirm: boolean;
  copied: boolean;
  showDeleteConfirm: boolean;
  isDeleting: boolean;
  showEditDialog: boolean;
  isUpdating: boolean;
};

type UiAction = { type: "PATCH"; payload: Partial<UiState> };

const initialUiState: UiState = {
  showConfirm: false,
  copied: false,
  showDeleteConfirm: false,
  isDeleting: false,
  showEditDialog: false,
  isUpdating: false,
};

function uiReducer(state: UiState, action: UiAction): UiState {
  switch (action.type) {
    case "PATCH":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function DetailedDialog({ item }: { item: Item }) {
  const islostObject = isLostObject(item);
  const { user } = useSharedContext();
  const [uiState, dispatchUi] = useReducer(uiReducer, initialUiState);

  const setUiState = (payload: Partial<UiState>) => {
    dispatchUi({ type: "PATCH", payload });
  };
  const router = useRouter();

  const isOwner = user?.email === item.email;
  const itemId = String(item.id);
  const itemType = item.type || "unknown";

  const contactAction = async (): Promise<ContactState> => {
    if (!user) {
      toast.error("Please sign in first.");
      return { status: "error", message: "Not authenticated." };
    }

    const contactPayload = {
      itemId,
      itemType,
      isLost: islostObject,
    };
    const contactItem = {
      id: item.id,
      name: item.name,
      type: item.type,
      email: item.email,
      image: item.image,
      description: item.description,
      itemDate: item.itemDate,
    };
    const finderName = user.name || "Anonymous";
    const finderEmail = user.email;

    let res: Response | null = null;

    try {
      // Track contact attempt
      trackItemContactAttempt(contactPayload);

      res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: contactItem,
          finderName,
          finderEmail,
        }),
      });
    } catch {
      toast.error("Network error. Please try again.");
      return { status: "error", message: "Network error." };
    }

    if (res && res.ok) {
      // Track successful contact
      trackItemContactSuccess(contactPayload);
      toast.success("Owner notified successfully!");
      return { status: "success", message: "Owner notified." };
    }

    // If we somehow have no response object here (should be handled by the catch above),
    // surface a clear error to avoid attempting to read from `res`.
    if (!res) {
      toast.error("No response from server. Please try again.");
      return { status: "error", message: "No response from server." };
    }

    const json = await res.json().catch(() => null);
    const errorMessage = json?.error || "Failed to send notification.";
    toast.error(errorMessage);
    return { status: "error", message: errorMessage };
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
      setUiState({ showConfirm: true });
    }
  };

  const handleCopy = async () => {
    const shareUrl = `${window.location.origin}/?item=${item.id}`;
    const sharePayload = {
      itemId,
      itemType,
      isLost: islostObject,
    };

    try {
      await navigator.clipboard.writeText(shareUrl);

      trackItemShareLink(sharePayload);

      setUiState({ copied: true });
      setTimeout(() => setUiState({ copied: false }), 1800);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  const handleDelete = async () => {
    setUiState({ isDeleting: true });
    const deletePayload = {
      itemId,
      itemType,
      isLost: islostObject,
    };
    let result: Awaited<ReturnType<typeof deleteItem>> | null = null;

    try {
      trackItemDeleted(deletePayload);
      result = await deleteItem({ id: item.id });
    } catch (error) {
      toast.error("Failed to delete item. Please try again.");
    }

    if (result) {
      if (!result.success) {
        toast.error(result.error || "Failed to delete item");
      } else {
        toast.success("Item deleted successfully");
        const url = new URL(window.location.href);
        url.searchParams.delete("item");
        window.history.replaceState({}, "", url.toString());
        router.refresh();
      }
    }

    setUiState({ isDeleting: false, showDeleteConfirm: false });
  };

  const isSubmitDisabled = isPending || state.status === "success";

  const handleEditClick = () => {
    trackEditItemDialogOpened({
      itemId,
      itemType,
    });
    setUiState({ showEditDialog: true });
  };

  const handleToggleResolved = async () => {
    if (islostObject) return; // not applicable
    setUiState({ isUpdating: true });
    const nextResolved = !item.isResolved;
    const resolvedPayload = {
      itemId,
      itemType,
      isLost: islostObject,
    };
    const currentIsHelped = item.isHelped ?? false;
    let result: Awaited<ReturnType<typeof updateItem>> | null = null;

    const updatePayloadResolved = {
      id: item.id,
      isResolved: nextResolved,
      isHelped: currentIsHelped,
    };
    try {
      result = await updateItem(updatePayloadResolved);
    } catch (error) {
      toast.error("Failed to update item. Please try again.");
    }

    if (result) {
      if (!result.success) {
        toast.error(result.error || "Failed to update item");
      } else {
        if (nextResolved) {
          trackItemResolved(resolvedPayload);
          toast.success("Item marked as resolved!");
        } else {
          toast.success("Item marked as unresolved.");
        }
        router.refresh();
      }
    }

    setUiState({ isUpdating: false });
  };

  const handleToggleHelped = async () => {
    if (!islostObject) return; // not applicable
    setUiState({ isUpdating: true });
    const nextHelped = !item.isHelped;
    const helpedPayload = {
      itemId,
      itemType,
      isLost: islostObject,
    };
    const currentIsResolved = item.isResolved ?? false;
    let result: Awaited<ReturnType<typeof updateItem>> | null = null;

    const updatePayloadHelped = {
      id: item.id,
      isResolved: currentIsResolved,
      isHelped: nextHelped,
    };
    try {
      result = await updateItem(updatePayloadHelped);
    } catch (error) {
      toast.error("Failed to update item. Please try again.");
    }

    if (result) {
      if (!result.success) {
        toast.error(result.error || "Failed to update item");
      } else {
        if (nextHelped) {
          trackItemHelped(helpedPayload);
          toast.success("Item marked as helped!");
        } else {
          toast.success("Item marked as unhelped.");
        }
        router.refresh();
      }
    }

    setUiState({ isUpdating: false });
  };

  return (
    <>
      <DialogContent className="w-[88vw] max-w-88 sm:max-w-lg bg-black/50 border-white/10 text-white p-0 pb-3 flex flex-col max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto backdrop-blur-xl shadow-2xl animate-in-fade">
        <DetailHeader item={item} />

        <div className="space-y-4 px-6 -mt-2 relative z-10">
          {/* Status Badge */}
          <div className="flex justify-start">
            <StatusSection item={item} isLost={islostObject} />
          </div>

          <DetailInfoGrid item={item} />

          <DetailDescription item={item} />

          <ContactSection
            user={user ?? null}
            copied={uiState.copied}
            showConfirm={uiState.showConfirm}
            state={state}
            isPending={isPending}
            isSubmitDisabled={isSubmitDisabled}
            onShowConfirmChange={(show) => setUiState({ showConfirm: show })}
            onCopyLink={handleCopy}
            onSignIn={handleSignIn}
            formAction={formAction}
          />

          {isOwner && uiState.showDeleteConfirm && (
            <DeleteConfirmSection
              isDeleting={uiState.isDeleting}
              onCancel={() => setUiState({ showDeleteConfirm: false })}
              onConfirm={handleDelete}
            />
          )}
        </div>

        {/* Footer Actions */}
        {user && !uiState.showConfirm && !uiState.showDeleteConfirm && (
          <div className="px-6 pt-4 pb-2 mt-auto">
            <ActionFooter
              item={item}
              user={user}
              isLost={islostObject}
              isUpdating={uiState.isUpdating}
              isDeleting={uiState.isDeleting}
              copied={uiState.copied}
              onEdit={handleEditClick}
              onToggleHelped={handleToggleHelped}
              onToggleResolved={handleToggleResolved}
              onDeleteConfirm={() => setUiState({ showDeleteConfirm: true })}
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
          open={uiState.showEditDialog}
          onOpenChange={(open) => setUiState({ showEditDialog: open })}
        />
      )}
    </>
  );
}

export { DetailedDialog };

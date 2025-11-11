"use client";
//write resolveItem in @/server/actions/item/update/resolve
//add resolve button if you are owner of post
//pop up dialog asking if zotnfound helped(not sure where to send that data)

//write editItem in @/server/actions/item/update/edit
//add edit button if owner of post
//form that lets user update all elements of the item
import { useActionState, useState } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { User, Calendar, MapPin, Share2, Check, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditItemForm from "./EditItem";
import editItem from "@/server/actions/item/update/edit";
import { isLostObject } from "@/lib/types";
import { Item } from "@/db/schema";
import Image from "next/image";
import { toast } from "sonner";
import { useSharedContext } from "../ContextProvider";
import { z } from "zod";
import deleteItem from "@/server/actions/item/delete/action";
import updateItem from "@/server/actions/item/update/action";
import { useRouter } from "next/navigation";
import { handleSignIn } from "@/lib/auth-client";
import { db } from "@/db";

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
  const [isResolved, setIsResolved] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Check if the current user owns this item
  const isOwner = user?.email === item.email;

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
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteItem({ itemId: item.id });

      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Item deleted successfully");
        // Close the dialog and refresh the page
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

  const handleResolve = async () => {
    setIsResolving(true);
    setIsResolved(true);
    //feedback popup
    //in feedback popup -> return isHelped(true or false based on yes/no)
    try {
      const result = await updateItem({ itemId: item.id, isResolved: true, isHelped: false});

      if ("error" in result) {
        toast.error(result.error);
      }
      else {
        setShowFeedback(true); //leads to modal for yes/no feedback
      }
    }
    catch (err)
    {
      toast.error("Failed to resolve item. Please try again.")
    }
    finally
    {
      setIsResolving(false);
    }
  }

  const handleFeedback = async (userWasHelped: boolean) => { 
    setShowFeedback(false);
    try {
      const result = await updateItem({itemId: item.id, isResolved: true, isHelped: userWasHelped});
      if ("error" in result)
      {
        toast.error(result.error);
      }
      console.log(result);
      toast.info("Thanks for the feedback!");
      const url = new URL(window.location.href);
      url.searchParams.delete("item");
      window.history.replaceState({}, "", url.toString());
      router.refresh();
    }
    catch (err)
    {
      toast.error("Feedback failed. Please try again.");
    }

  }

  const isSubmitDisabled = isPending || state.status === "success";

  return (
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
              Sign in with your UCI email to contact the owner directly from
              ZotNFound.
            </p>
            <div className="flex gap-2 w-full flex-col">
              <Button
                variant="default"
                className="bg-white/5 hover:bg-white/10 tex-white w-full"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCopy}
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

        {isOwner && showDeleteConfirm && (
          <div className="space-y-3 pt-2 text-sm border-t border-white/20 mt-4 pt-4">
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
        <div className="flex justify-between items-center gap-2 px-4 sm:px-6 border-t border-white/20 pt-3 mt-2">
          {isOwner && (
          <div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm px-3 py-1.5"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
            <Button 
            type="button"
            variant="ghost"
            disabled={isResolving}
            onClick = {() => handleResolve()}>
              {isResolving ? "Resolving..." : isResolved ? "Resolved" : "Resolve"}              
            </Button>
            {/* <Button
            type="button"
            variant="ghost"
            disabled={isEditing}
            onClick = {() => setIsEditing(true)}> Edit
            </Button> */}

            {showFeedback && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40">
              <div className="bg-black p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg mb-4">Did ZotnFound help with finding this item?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleFeedback(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
        )}
          {/* {isEditing && <EditItemForm 
          itemId = {item.id}
          name={item.name}
          description={item.description}
          type={item.type}
          date={item.date}
          imageURL={item.image}
          location={item.location}/>} */}
          </div>
          )}

          <div className="flex justify-end gap-2 ml-auto">
            <Button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 border-white/20 text-white bg-white/5 hover:bg-white/10 text-sm px-3 py-1.5"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </Button>

            <Button
              variant="outline"
              className="bg-black hover:bg-white/10 border-white/30 text-white hover:text-white transition-all duration-200 hover:scale-105 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
              onClick={handleContactClick}
              disabled={isPending || state.status === "success"}
            >
              {state.status === "success" ? "Sent" : "Contact"}
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  );
}

export { DetailedDialog };

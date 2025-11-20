"use client";

import { Button } from "@/components/ui/button";
import {
  Edit,
  CheckCircle,
  Trash2,
  Share2,
  Check,
  MessageCircle,
} from "lucide-react";
import type { Item } from "@/db/schema";

type UserLike = {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  image?: string | null;
};

/**
 * ActionFooter
 *
 * Presents all actionable buttons for an item within the detailed dialog:
 *  - Edit (owner only)
 *  - Mark as Helped / Unhelp (lost items, owner only)
 *  - Mark as Resolved / Unresolve (found items, owner only)
 *  - Delete (owner only)
 *  - Copy share link
 *  - Contact (non-owner signed-in users)
 *
 * This component is stateless: all side-effects and mutations are delegated via callback props.
 */

export interface ActionFooterProps {
  item: Item;
  user: UserLike | null;
  isLost: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  copied: boolean;
  onEdit: () => void;
  onToggleHelped: () => void;
  onToggleResolved: () => void;
  onDeleteConfirm: () => void;
  onCopyLink: () => void;
  onContact: () => void;
  contactDisabled: boolean;
  className?: string;
}

export function ActionFooter({
  item,
  user,
  isLost,
  isUpdating,
  isDeleting,
  copied,
  onEdit,
  onToggleHelped,
  onToggleResolved,
  onDeleteConfirm,
  onCopyLink,
  onContact,
  contactDisabled,
  className,
}: ActionFooterProps) {
  const isOwner = user?.email === item.email;

  return (
    <div
      className={
        className ??
        "flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
      }
    >
      {isOwner ? (
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
          {/* Edit */}
          <Button
            type="button"
            variant="ghost"
            onClick={onEdit}
            disabled={isDeleting || isUpdating}
            className="flex-1 sm:flex-none items-center gap-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-200 h-10 px-4 rounded-xl"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>

          {/* Helped toggle (lost items) */}
          {isLost && (
            <Button
              type="button"
              variant="ghost"
              onClick={onToggleHelped}
              disabled={isDeleting || isUpdating}
              className={`flex-1 sm:flex-none items-center gap-2 h-10 px-4 rounded-xl border transition-all duration-300 ${
                item.isHelped
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20"
                  : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>{item.isHelped ? "Unhelp" : "Mark as Helped"}</span>
            </Button>
          )}

          {/* Resolved toggle (found items) */}
          {!isLost && (
            <Button
              type="button"
              variant="ghost"
              onClick={onToggleResolved}
              disabled={isDeleting || isUpdating}
              className={`flex-1 sm:flex-none items-center gap-2 h-10 px-4 rounded-xl border transition-all duration-300 ${
                item.isResolved
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20"
                  : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span>{item.isResolved ? "Unresolve" : "Mark as Resolved"}</span>
            </Button>
          )}

          {/* Delete */}
          <Button
            type="button"
            variant="ghost"
            onClick={onDeleteConfirm}
            disabled={isDeleting || isUpdating}
            className="flex-1 sm:flex-none items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all duration-200 h-10 px-4 rounded-xl"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Delete</span>
          </Button>
        </div>
      ) : (
        <div />
      )}

      {/* Right group: common actions */}
      <div className="flex flex-row gap-2 w-full sm:w-auto justify-center sm:justify-end">
        <Button
          type="button"
          onClick={onCopyLink}
          className="flex-1 sm:flex-none items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 h-10 px-4 rounded-xl transition-all duration-200"
          disabled={isDeleting || isUpdating}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span>{copied ? "Copied!" : "Share"}</span>
        </Button>

        {!isOwner && user && (
          <Button
            className="flex-1 sm:flex-none items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 h-10 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
            onClick={onContact}
            disabled={contactDisabled || isDeleting || isUpdating}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{contactDisabled ? "Sent" : "Contact Owner"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default ActionFooter;

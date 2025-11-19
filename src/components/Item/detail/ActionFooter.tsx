"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle, Trash2, Share2, Check } from "lucide-react";
import type { Item } from "@/db/schema";
/* Accept broader user shape (picture optional, image optional) */
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
        "flex w-full flex-row flex-wrap items-center justify-between gap-2"
      }
    >
      {isOwner && (
        <div className="flex flex-wrap gap-2">
          {/* Edit */}
          <Button
            type="button"
            variant="ghost"
            onClick={onEdit}
            disabled={isDeleting || isUpdating}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 text-sm px-3 py-1.5"
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
              className={`flex items-center gap-2 ${
                item.isHelped
                  ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  : "text-green-400 hover:text-green-300 hover:bg-green-500/10"
              } text-sm px-3 py-1.5`}
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
              className={`flex items-center gap-2 ${
                item.isResolved
                  ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                  : "text-green-400 hover:text-green-300 hover:bg-green-500/10"
              } text-sm px-3 py-1.5`}
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
            className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm px-3 py-1.5"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      )}

      {/* Right group: common actions */}
      <div className="flex flex-wrap justify-end gap-2 ml-auto">
        <Button
          type="button"
          onClick={onCopyLink}
          className="flex items-center gap-2 border-white/20 text-white bg-white/5 hover:bg-white/10 text-sm px-3 py-1.5"
          disabled={isDeleting || isUpdating}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </Button>

        {!isOwner && user && (
          <Button
            variant="outline"
            className="bg-black hover:bg-white/10 border-white/30 text-white hover:text-white transition-all duration-200 hover:scale-105 text-sm px-3 py-1.5"
            onClick={onContact}
            disabled={contactDisabled || isDeleting || isUpdating}
          >
            {contactDisabled ? "Sent" : "Contact"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ActionFooter;

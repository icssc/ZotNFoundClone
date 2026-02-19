"use client";

import { Button } from "@/components/ui/button";

interface DeleteConfirmSectionProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmSection({
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteConfirmSectionProps) {
  return (
    <div className="space-y-3 text-sm border-t border-white/10 mt-4 pt-4 animate-in-fade">
      <p className="text-red-400 font-medium text-center">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-center">
        <Button
          type="button"
          variant="ghost"
          disabled={isDeleting}
          onClick={onCancel}
          className="bg-white/5 hover:bg-white/10 text-white"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting}
          onClick={onConfirm}
          className="bg-red-600/80 hover:bg-red-600 text-white"
        >
          {isDeleting ? "Deleting..." : "Delete Item"}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import editItem from "@/server/actions/item/update/edit";
import { toast } from "sonner"; // optional, for nice feedback
import { PointTuple } from "leaflet";

interface EditItemModalProps {
  itemId: number;
  name: string;
  description: string;
  type: string;
  date: string;
  imageURL: string;
  location: PointTuple;
  onClose: () => void;
}

export default function EditItemModal({
  itemId,
  name: initialName,
  description: initialDescription,
  type: initialType,
  date: initialDate,
  imageURL: initialImageURL,
  location: initialLocation,
}: EditItemModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [itemType, setItemType] = useState(initialType);
  const [date, setDate] = useState(initialDate);
  const [imageURL, setImageURL] = useState(initialImageURL);
  const [location, setLocation] = useState<PointTuple>(initialLocation);

  const [isPending, startTransition] = useTransition();

  const onClose = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("item");
    window.history.replaceState({}, "", url.toString());
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await editItem({
          itemId,
          itemName: name,
          itemDescription: description,
          type: itemType,
          itemDate: date,
          image: imageURL,
          location,
        });

        if ("error" in result) {
          toast.error(result.error ?? "Error updating item");
        } else {
          toast.success("Item updated successfully!");
          onClose();
        }
      } catch (err) {
        console.error("Edit error:", err);
        toast.error("Unexpected error updating item");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Item Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              rows={3}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input
              type="text"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1">Location(s)</label>
            <input
              type="text"
              value={location.join(", ")}
              onChange={(e) =>
                setLocation(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="Enter locations separated by commas"
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

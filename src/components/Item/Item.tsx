import React from "react";
import { Button } from "@/components/ui/button";
import { isLostObject } from "@/lib/types";
import { Item as ItemType } from "@/db/schema";
import Image from "next/image";

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export default function Item({
  item,
  onClick,
  setOpen,
}: {
  item: ItemType;
  onClick: () => void;
  setOpen: (open: boolean) => void;
}) {
  const islostObject = isLostObject(item);
  if (!item) {
    return;
  }
  return (
    <div
      onClick={onClick}
      className="flex flex-col overflow-hidden border-b border-white/20 cursor-pointer bg-black hover:bg-white/5 rounded-md transition-all duration-300 hover:shadow-lg hover:scale-[1.015] animate-in fade-in slide-in-from-bottom-1 my-3"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={
            item.image && isValidUrl(item.image)
              ? item.image
              : "/placeholder.jpg"
          }
          alt={item.name || "Item Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 45vw"
          style={{ objectFit: "cover" }}
          loading="lazy"
          preload={false}
          fetchPriority="low"
          priority={false}
          quality="45"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-row justify-between items-end gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate text-lg">
                {item.name}
              </p>
              <p className="text-sm text-gray-300 truncate">
                {islostObject ? "Lost" : "Found"}
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-sm text-gray-300 truncate whitespace-nowrap">
                {item.date}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-400 line-clamp-2 overflow-hidden text-ellipsis mb-3">
          {item.description}
        </p>
        <div className="flex flex-row justify-end">
          <Button
            onClick={() => {
              setOpen(true);
            }}
            className="transition-all duration-200"
          >
            {islostObject ? "I Found This" : "This Is Mine"}
          </Button>
        </div>
      </div>
    </div>
  );
}

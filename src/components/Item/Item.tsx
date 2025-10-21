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
      className="flex flex-col p-4 border-b border-white/20 cursor-pointer bg-black hover:bg-white/5 rounded-md transition-all duration-300 hover:shadow-lg hover:scale-[1.015] animate-in fade-in slide-in-from-bottom-1"
    >
      <div className="flex flex-row justify-between items-start gap-2">
        <div className="flex flex-row items-center space-x-2 flex-1 min-w-0">
          <div className="h-8 w-8 relative rounded-full overflow-hidden shrink-0">
            <Image
              src={
                item.image && isValidUrl(item.image)
                  ? item.image
                  : "/placeholder.jpg"
              }
              alt={item.name || "Item Image"}
              fill
              sizes="32px"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{item.name}</p>
            <p className="text-sm text-gray-400 truncate">
              {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <p className="text-sm text-gray-400 truncate whitespace-nowrap">
            {item.date}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-400 line-clamp-2 overflow-hidden text-ellipsis">
          {item.description}
        </p>
      </div>
      <div className="flex flex-row justify-end mt-2">
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
  );
}

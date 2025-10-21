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
      className="flex flex-col p-4 border-b border-white/20 cursor-pointer bg-black hover:bg-white/5 rounded-md transition-all hover:shadow-lg hover:scale-[1.015] animate-in fade-in slide-in-from-bottom-1"
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-2">
          <div className="h-8 w-8 relative rounded-full overflow-hidden">
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
          <div>
            <p className="font-semibold text-white line-clamp-1 truncate max-w-[140px] sm:max-w-[180px] md:max-w-[220px]">
              {item.name}
            </p>
            <p className="text-sm text-gray-400 line-clamp-1 truncate">
              {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400 line-clamp-1 truncate max-w-[90px]">
            {item.date}
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400 line-clamp-2 overflow-hidden">
          {item.description}
        </p>
      </div>
      <div className="flex flex-row justify-end">
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          {islostObject ? "I Found This" : "This Is Mine"}
        </Button>
      </div>
    </div>
  );
}

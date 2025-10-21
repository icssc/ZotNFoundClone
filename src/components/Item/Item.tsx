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
      className="flex flex-col p-4 border-b border-gray-200 cursor-pointer bg-gray-300 hover:bg-gray-50 duration-200 rounded-md transition-colors"
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
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">
              {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{item.date}</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
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

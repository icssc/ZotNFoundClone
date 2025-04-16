import React from "react";
import { Button } from "@/components/ui/button";
import { isLostObject, type Object } from "@/lib/types";

export default function Item({
  item,
  onClick,
  setOpen,
}: {
  item: Object;
  onClick: () => void;
  setOpen: (open: boolean) => void;
}) {
  const islostObject = isLostObject(item);

  return (
    <div
      onClick={onClick}
      className="flex flex-col p-4 border-b border-gray-200 cursor-pointer bg-gray-300 hover:bg-gray-50 duration-200 rounded-md transition-colors"
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div>
            <p className="font-semibold">{item.itemName}</p>
            <p className="text-sm text-gray-500">
              {islostObject ? "Lost" : "Found"} by {item.personName}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{item.date}</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 line-clamp-2">
          {item.itemDescription}
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

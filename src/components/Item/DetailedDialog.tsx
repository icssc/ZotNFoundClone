"use client";
import { DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { isLostObject, type Object } from "@/lib/types";

function Item({
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

function ItemDetailDialog({ item }: { item: Object }) {
  const islostObject = isLostObject(item);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{item.itemName}</DialogTitle>
        <DialogDescription>
          {islostObject ? "Lost" : "Found"} item details
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Person</p>
            <p className="text-sm text-gray-500">{item.personName}</p>
            <p className="text-sm text-gray-500">
              {"No contact info provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-sm text-gray-500">{item.date}</p>
            <p className="text-sm text-gray-500">
              Status: {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-500">
              {item.location || "No location provided"}
            </p>
          </div>
        </div>

        <div className="pt-2">
          <p className="font-medium">Description</p>
          <p className="text-sm text-gray-600 mt-1">{item.itemDescription}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Contact</Button>
      </div>
    </DialogContent>
  );
}

export { Item, ItemDetailDialog };
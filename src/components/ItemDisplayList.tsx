"use client";
import { checkReturned, isLostObject, type Object } from "@/lib/types";
import { memo, useState } from "react";
import { foundObjects, lostObjects } from "@/lib/fakeData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User } from "lucide-react";

// memoize component which filters data (we do down the line) https://react.dev/reference/react/useMemo
const ItemDisplayList = memo(function ItemDisplayList() {
  const items: Object[] = (foundObjects as Object[]).concat(
    lostObjects as Object[]
  );

  // * Causes key error with duplicate keys
  const moreitems: Object[] = [
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
  ];

  return (
    <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
      {moreitems.map((item: Object, index) => (
        <Item key={`${item.itemId}-${index}`} {...item} />
      ))}
    </div>
  );
});

export default ItemDisplayList;

// * Potentially prevent re-render of each card on click (triggering useState, by https://react.dev/reference/react/useState#storing-information-from-previous-renders)
// Making the card inside the dialog its own component
const Item = function Item(prop: Object) {
  const [open, setOpen] = useState(false);
  const islostObject = isLostObject(prop);
  const isreturnedObject = checkReturned(prop);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-md transition-colors">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div>
                <p className="font-semibold">{prop.itemName}</p>
                <p className="text-sm text-gray-500">
                  {islostObject ? "Lost" : "Found"} by {prop.personName}
                </p>
                <p>{isreturnedObject ? "Returned" : "Not Returned"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">{prop.date}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 line-clamp-2">
              {prop.itemDescription}
            </p>
          </div>
        </div>
      </DialogTrigger>

      {/* Only render dialog content when dialog is open */}
      {open && <ItemDetailDialog item={prop} />}
    </Dialog>
  );
};

function ItemDetailDialog({
  item,
}: {
  item: Object;
}) {
  const islostObject = isLostObject(item);
  const isreturnedObject = checkReturned(item);

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
              Status: {isreturnedObject ? "Returned" : "Not Returned"}
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
        {!isreturnedObject && (
          <Button>{islostObject ? "I Found This" : "This Is Mine"}</Button>
        )}
      </div>
    </DialogContent>
  );
};

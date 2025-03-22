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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User } from "lucide-react";
// TODO: Move up the items to global state with useContext, to 1. make re-renders easier to deal with, 2. make it easier to filter the items
// ? https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries

const ItemDisplayList = memo(function ItemDisplayList() {
  const items: Object[] = (foundObjects as Object[]).concat(
    lostObjects as Object[]
  );

  const moreitems: Object[] = [
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
  ];

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Object | null>(null);

  const handleItemClick = (item: Object) => {
    setSelectedItem(item);
    setOpen(true);
  };

  return (
    <>
      <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
        {moreitems.map((item: Object, index) => (
          <Item
            key={`${item.itemId}-${index}`}
            item={item}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {selectedItem && <ItemDetailDialog item={selectedItem} />}
      </Dialog>
    </>
  );
});

export default ItemDisplayList;

function Item({ item, onClick }: { item: Object; onClick: () => void }) {
  const islostObject = isLostObject(item);
  const isreturnedObject = checkReturned(item);

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
            <p>{isreturnedObject ? "Returned" : "Not Returned"}</p>
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
    </div>
  );
}

function ItemDetailDialog({ item }: { item: Object }) {
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
}

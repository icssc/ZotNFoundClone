"use client";
// Also has to be a client compnonent because interaticitivity is needed with things like onClick and useState, but we could do ssr for getting the data here!
import { isLostObject, type Object } from "@/lib/types";
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
import { useMapContext } from "./ContextProvider";
// TODO: Move up the items to global state with useContext, to 1. make re-renders easier to deal with, 2. make it easier to filter the items
// ? https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries

const ItemDisplayList = memo(function ItemDisplayList() {
  const { setSelectedLocation } = useMapContext();
  const items: Object[] = (foundObjects as Object[]).concat(
    lostObjects as Object[]
  );

  const moreitems: Object[] = items;

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Object | null>(null);

  const handleItemClick = (item: Object) => {
    setSelectedItem(item);
    setSelectedLocation(item.location);
  };

  return (
    <>
      <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
        {moreitems.map((item: Object, index) => (
          <Item
            key={`${item.itemId}-${index}`}
            item={item}
            onClick={() => handleItemClick(item)}
            setOpen={setOpen}
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


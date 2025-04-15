"use client";
// Also has to be a client compnonent because interaticitivity is needed with things like onClick and useState, but we could do ssr for getting the data here!
import { type Object } from "@/lib/types";
import { useState } from "react";
import { foundObjects, lostObjects } from "@/lib/fakeData";
import { Dialog } from "@/components/ui/dialog";
import { useMapContext } from "../ContextProvider";
import { ItemDetailDialog, Item } from "@/components/Item/DetailedDialog";
// TODO: Move up the items to global state with useContext, to 1. make re-renders easier to deal with, 2. make it easier to filter the items
// ? https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries

function ItemDisplayList() {
  const { setSelectedLocation } = useMapContext();
  const items: Object[] = (foundObjects as Object[]).concat(
    lostObjects as Object[]
  );

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Object | null>(null);

  const handleItemClick = (item: Object) => {
    setSelectedItem(item);
    setSelectedLocation(item.location);
  };

  return (
    <>
      <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
        {items.map((item: Object, index) => (
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
}

export default ItemDisplayList;

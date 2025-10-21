"use client";

import { stringArrayToLatLng } from "@/lib/types";
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useSharedContext } from "../ContextProvider";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import Item from "@/components/Item/Item";
import { Item as ItemType } from "@/db/schema";
import { LatLngExpression } from "leaflet";
import { filterItems } from "@/lib/utils";

interface ItemDisplayListProps {
  initialItems: ItemType[];
}

function ItemDisplayList({ initialItems }: ItemDisplayListProps) {
  const { setSelectedLocation, filter } = useSharedContext();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const items = initialItems;
  useEffect(() => {
    function handleItemCreated(event: Event) {
      const createdEvent = event as CustomEvent<ItemType>;
    }
    function handleItemCreateFailed() {
      // Optionally handle failure (toast/snackbar). No optimistic revert needed now.
    }
    window.addEventListener("item-created", handleItemCreated);
    window.addEventListener("item-create-failed", handleItemCreateFailed);
    return () => {
      window.removeEventListener("item-created", handleItemCreated);
      window.removeEventListener("item-create-failed", handleItemCreateFailed);
    };
  }, []);

  const handleItemClick = (item: ItemType) => {
    setSelectedItem(item);
    if (item.location) {
      const location: LatLngExpression = stringArrayToLatLng(item.location);
      setSelectedLocation(location);
    }
  };

  const filteredItems = filterItems(items, filter);
  return (
    <>
      <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
        {filteredItems.map((item: ItemType, index: number) => (
          <Item
            key={item.id ?? index}
            item={item}
            onClick={() => handleItemClick(item)}
            setOpen={setOpen}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {selectedItem && <DetailedDialog item={selectedItem} />}
      </Dialog>
    </>
  );
}

export default ItemDisplayList;

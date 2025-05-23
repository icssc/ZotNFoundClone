"use client";

import { stringArrayToLatLng } from "@/lib/types";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useSharedContext } from "../ContextProvider";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import Item from "@/components/Item/Item";
import { Item as ItemType } from "@/db/schema";
import { LatLngExpression } from "leaflet";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FETCH_ITEMS } from "@/lib/options";

function ItemDisplayList() {
  const { setSelectedLocation } = useSharedContext();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const { data, error, isLoading } = useSuspenseQuery(FETCH_ITEMS);
  const handleItemClick = (item: ItemType) => {
    setSelectedItem(item);
    if (item.location) {
      const location: LatLngExpression = stringArrayToLatLng(item.location);
      setSelectedLocation(location);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Error loading items: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
        {data!.map((item: ItemType, index: number) => (
          <Item
            key={index}
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

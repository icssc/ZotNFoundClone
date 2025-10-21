"use client";

import { stringArrayToLatLng } from "@/lib/types";
import { useState } from "react";
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
      <div className="item-display-list flex h-full overflow-y-auto flex-col p-4 space-y-3 bg-black/95 rounded-md animate-in fade-in duration-300">
        {filteredItems.map((item: ItemType, index: number) => (
          <div
            key={item.id ?? index}
            className="group animate-in fade-in slide-in-from-bottom-1 duration-200 will-change-transform"
          >
            <Item
              item={item}
              onClick={() => handleItemClick(item)}
              setOpen={setOpen}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .item-display-list p {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <Dialog open={open} onOpenChange={setOpen}>
        {selectedItem && <DetailedDialog item={selectedItem} />}
      </Dialog>
    </>
  );
}

export default ItemDisplayList;

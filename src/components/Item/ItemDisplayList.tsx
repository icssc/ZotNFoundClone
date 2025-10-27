"use client";

import { stringArrayToLatLng } from "@/lib/types";
import { useMemo } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useSharedContext } from "../ContextProvider";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import Item from "@/components/Item/Item";
import { Item as ItemType } from "@/db/schema";
import { LatLngExpression } from "leaflet";
import { filterItems } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface ItemDisplayListProps {
  initialItems: ItemType[];
}

function ItemDisplayList({ initialItems }: ItemDisplayListProps) {
  const { setSelectedLocation, filter } = useSharedContext();
  const searchParams = useSearchParams();

  const selectedItem = useMemo(() => {
    const itemId = searchParams.get("item");
    if (!itemId) return null;
    const item =
      initialItems.find((item) => item.id === parseInt(itemId)) || null;
    if (item && item.location) {
      const location: LatLngExpression = stringArrayToLatLng(item.location);
      setSelectedLocation(location);
    }
    return item;
  }, [searchParams, initialItems]);

  const handleItemClick = (item: ItemType) => {
    // Update URL with item parameter
    const url = new URL(window.location.href);
    url.searchParams.set("item", item.id.toString());
    window.history.pushState({}, "", url.toString());

    if (item.location) {
      const location: LatLngExpression = stringArrayToLatLng(item.location);
      setSelectedLocation(location);
    }
  };

  const handleActionButtonClick = (item: ItemType) => {
    // Update URL with item parameter to show the dialog
    const url = new URL(window.location.href);
    url.searchParams.set("item", item.id.toString());
    window.history.pushState({}, "", url.toString());
  };

  const filteredItems = filterItems(initialItems, filter);
  return (
    <>
      <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
        {filteredItems.map((item: ItemType, index: number) => (
          <Item
            key={item.id ?? index}
            item={item}
            onClick={() => handleItemClick(item)}
            setOpen={() => handleActionButtonClick(item)}
          />
        ))}
      </div>

      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => {
          if (!open) {
            // Remove the item parameter from URL
            const url = new URL(window.location.href);
            url.searchParams.delete("item");
            window.history.replaceState({}, "", url.toString());
          }
        }}
      >
        {selectedItem && <DetailedDialog item={selectedItem} />}
      </Dialog>
    </>
  );
}

export default ItemDisplayList;

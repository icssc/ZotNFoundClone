"use client";

import { stringArrayToLatLng } from "@/lib/types";
import { Dialog } from "@/components/ui/dialog";
import { useSharedContext } from "../ContextProvider";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import Item from "@/components/Item/Item";
import { Item as ItemType } from "@/db/schema";
import type { LatLngExpression } from "leaflet";
import { filterItems } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SearchX } from "lucide-react";

interface ItemDisplayListProps {
  initialItems: ItemType[];
}

function ItemDisplayList({ initialItems }: ItemDisplayListProps) {
  const { setSelectedLocation, filter } = useSharedContext();
  const searchParams = useSearchParams();

  function getSelectedItem() {
    const itemId = searchParams.get("item");
    if (!itemId) return null;
    const item =
      initialItems.find((item) => item.id === parseInt(itemId)) || null;
    return item;
  }
  const selectedItem = getSelectedItem();

  useEffect(() => {
    if (selectedItem) {
      const location: LatLngExpression = stringArrayToLatLng(
        selectedItem.location
      );
      setSelectedLocation(location);
    }
  }, [selectedItem, setSelectedLocation]);

  const handleItemClick = (item: ItemType) => {
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
      <div className="item-display-list flex h-full overflow-y-auto flex-col p-4 space-y-4 bg-black/80 backdrop-blur-xl border-r border-white/5 animate-in fade-in duration-500">
        {filteredItems.length > 0 ? (
          filteredItems.map((item: ItemType, index: number) => (
            <div
              key={item.id ?? index}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Item
                item={item}
                onClick={() => handleItemClick(item)}
                setOpen={() => handleActionButtonClick(item)}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 rounded-full bg-white/5 mb-4">
              <SearchX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              No items found
            </h3>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
        )}
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

"use client";

import { stringArrayToLatLng } from "@/lib/types";
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
  function getSelectedItem() {
    const itemId = searchParams.get("item");
    if (!itemId) return null;
    const item =
      initialItems.find((item) => item.id === parseInt(itemId)) || null;
    return item;
  }
  const selectedItem = getSelectedItem();

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
      <div className="item-display-list flex h-full overflow-y-auto flex-col p-4 space-y-3 bg-black/95 rounded-md animate-in fade-in duration-300 transition-all">
        {filteredItems.map((item: ItemType, index: number) => (
          <div
            key={item.id ?? index}
            className="group animate-in fade-in slide-in-from-bottom-1 duration-200 will-change-transform transition-all"
          >
            <Item
              item={item}
              onClick={() => handleItemClick(item)}
              setOpen={() => handleActionButtonClick(item)}
            />
          </div>
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

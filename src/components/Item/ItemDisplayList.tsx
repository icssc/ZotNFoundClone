"use client";

import { type Object } from "@/lib/types";
import { useState } from "react";
import { foundObjects, lostObjects } from "@/lib/fakeData";
import { Dialog } from "@/components/ui/dialog";
import { useMapContext } from "../ContextProvider";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import Item from "@/components/Item/Item";
// import { useItems } from "@/hooks/GetAllItems";

function ItemDisplayList() {
  const { setSelectedLocation } = useMapContext();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Object | null>(null);
  // const { data, error, isLoading } = useItems();
  const handleItemClick = (item: Object) => {
    setSelectedItem(item);
    setSelectedLocation(item.location);
  };

  const data: Object[] = (lostObjects as Object[]).concat(foundObjects);
  // if (isLoading) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <p>Loading items...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <p>Error loading items: {error.message}</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="flex h-full overflow-y-scroll flex-col p-4 space-y-4">
        {data.map((item: Object, index) => (
          <Item
            key={`${item.itemId}-${index}`}
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

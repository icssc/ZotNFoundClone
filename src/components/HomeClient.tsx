"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/db/schema";
import { LazyMap } from "@/components/Map/LazyMap";
import ItemDisplayList from "@/components/Item/ItemDisplayList";

interface HomeClientProps {
  initialItems: Item[];
}

function compareItems(a: Item, b: Item) {
  const dateCompare = (b.date ?? "").localeCompare(a.date ?? "");
  if (dateCompare !== 0) {
    return dateCompare;
  }

  return b.id - a.id;
}

function sortItems(items: Item[]) {
  return [...items].sort(compareItems);
}

export default function HomeClient({ initialItems }: HomeClientProps) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const upsertItem = (nextItem: Item) => {
    setItems((current) => {
      const nextItems = current.filter((item) => item.id !== nextItem.id);
      nextItems.unshift(nextItem);
      return sortItems(nextItems);
    });
  };

  const removeItem = (itemId: number) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  return (
    <div className="home-shell w-full h-[90vh] flex flex-col items-center px-3 sm:px-4 lg:px-6 py-3">
      <main
        className="
          home-shell-main
          w-full
          h-[90vh]
          flex
          flex-col
          gap-4
          lg:flex-row
          animate-in
          fade-in
          duration-500
        "
      >
        <div
          className="
          home-shell-pane
          w-full
          h-[55vh]
          lg:h-full
          lg:flex-1
          animate-in
          slide-in-from-left
          duration-700
          ease-out
        "
        >
          <LazyMap initialItems={items} onItemCreated={upsertItem} />
        </div>

        <div
          className="
          home-shell-pane
          w-full
          h-[40vh]
          lg:h-full
          lg:w-105
          xl:w-105
          animate-in
          slide-in-from-right
          duration-700
          ease-out
        "
        >
          <ItemDisplayList
            initialItems={items}
            onItemUpdated={upsertItem}
            onItemDeleted={removeItem}
          />
        </div>
      </main>
    </div>
  );
}

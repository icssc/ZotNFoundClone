import ItemDisplayList from "@/components/Item/ItemDisplayList";
import { LazyMap } from "@/components/Map/LazyMap";
import { getAllItems } from "@/server/data/item/queries";
import { isError } from "@/lib/types";
import { Suspense } from "react";

export default async function Home() {
  const itemsResult = await getAllItems();

  if (isError(itemsResult)) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Error loading items: {itemsResult.error}</p>
      </div>
    );
  }

  const items = itemsResult.data;
  items.sort((a, b) => {
    const dateA = new Date(a.date!);
    const dateB = new Date(b.date!);
    return dateB.getTime() - dateA.getTime();
  });
  return (
    <div className="md:h-[85vh] w-full flex flex-col justify-center items-center p-4">
      <main className="w-full p-12 h-full flex flex-row">
        <div className="flex flex-row gap-10 h-full w-full">
          <div className="w-8/10 h-full">
          {/* Suspense is used because I got errors without it */}
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading map...</div>}>
              <LazyMap initialItems={items} />
            </Suspense>
          </div>
          <div className="w-2/10 bg-gray-100 rounded-lg h-full">
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading items...</div>}>
              <ItemDisplayList initialItems={items} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

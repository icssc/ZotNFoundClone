import ItemDisplayList from "@/components/Item/ItemDisplayList";
import { LazyMap } from "@/components/Map/LazyMap";
import { getAllItems } from "@/server/data/item/queries";
import { Suspense } from "react";

// uncache page

export const dynamic = "force-dynamic";

export default async function Home() {
  const itemsResult = await getAllItems();

  if (itemsResult.error || !itemsResult.data) {
    return (
      <div className="flex h-full items-center justify-center text-red-400">
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
    <div className="w-full h-[90vh] flex flex-col items-center px-3 sm:px-4 lg:px-6 py-3">
      <main
        className="
          w-full
          h-[90vh]
          flex
          flex-col
          gap-4
          lg:flex-row
          animate-in
          fade-in
          duration-500
          transition-all
        "
      >
        {/* Map Section */}
        <div
          className="
          w-full
          h-[55vh]
          lg:h-full
          lg:flex-1
          animate-in
          slide-in-from-left
          duration-700
          transition-all
          ease-out
        "
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                Loading map...
              </div>
            }
          >
            <LazyMap initialItems={items} />
          </Suspense>
        </div>

        {/* Item List Section */}
        <div
          className="
          w-full
          h-[40vh]
          lg:h-full
          lg:w-105
          xl:w-105
          animate-in
          slide-in-from-right
          duration-700
          transition-all
          ease-out
        "
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                Loading items...
              </div>
            }
          >
            <ItemDisplayList initialItems={items} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

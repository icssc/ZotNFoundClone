import ItemDisplayList from "@/components/Item/ItemDisplayList";
import { LazyMap } from "@/components/Map/LazyMap";
import { getAllItems } from "@/server/data/item/queries";
import { isError } from "@/lib/types";
async function AuthenticatedContent() {
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
          <LazyMap initialItems={items} />
        </div>

        {/* Item List Section */}
        <div
          className="
          w-full
          h-[40vh]
          lg:h-full
          lg:w-[420px]
          xl:w-[480px]
          animate-in
          slide-in-from-right
          duration-700
          transition-all
          ease-out
        "
        >
          <ItemDisplayList initialItems={items} />
        </div>
      </main>
    </div>
  );
}

export default async function Home() {
  return <AuthenticatedContent />;
}

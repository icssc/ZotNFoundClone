import ItemDisplayList from "@/components/Item/ItemDisplayList";
import { LazyMap } from "@/components/Map/LazyMap";
import { getAllItems } from "@/server/data/item/queries";
import { isError } from "@/lib/types";

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
    <div className="w-full flex flex-col items-center px-3 sm:px-4 lg:px-8 py-4">
      <main
        className="
          w-full flex flex-col gap-6
          lg:flex-row
          lg:items-start
          lg:justify-center
          animate-in fade-in duration-300
        "
      >
        {/* Map Wrapper with Corner Decorations */}
        <div
          className="
            relative w-full lg:w-[80%]
            h-[46vh] sm:h-[55vh] md:h-[60vh] lg:h-[70vh]
            flex
            items-stretch
            group
            transition-all
          "
        >
          {/* Corner accents */}
          {/* Top Left */}
          <div className="pointer-events-none absolute top-0 left-0 h-8 w-8">
            <div className="absolute top-0 left-0 h-6 w-1 bg-white" />
            <div className="absolute top-0 left-0 w-6 h-1 bg-white" />
          </div>
          {/* Top Right */}
          <div className="pointer-events-none absolute top-0 right-0 h-8 w-8">
            <div className="absolute top-0 right-0 h-6 w-1 bg-white" />
            <div className="absolute top-0 right-0 w-6 h-1 bg-white" />
          </div>
          {/* Bottom Left */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8">
            <div className="absolute bottom-0 left-0 h-6 w-1 bg-white" />
            <div className="absolute bottom-0 left-0 w-6 h-1 bg-white" />
          </div>
          {/* Bottom Right */}
          <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8">
            <div className="absolute bottom-0 right-0 h-6 w-1 bg-white" />
            <div className="absolute bottom-0 right-0 w-6 h-1 bg-white" />
          </div>

          {/* Map container border frame */}
          <div
            className="
              absolute inset-0 border border-white/20
              rounded-sm
              shadow-[0_0_0_1px_rgba(255,255,255,0.05)]
            "
          />

          <div className="relative z-10 w-full h-full">
            <LazyMap initialItems={items} />
          </div>
        </div>

        {/* Item List */}
        <div
          className="
            w-full lg:w-[20%]
            h-[38vh] sm:h-[42vh] md:h-[50vh] lg:h-[70vh]
            overflow-hidden
            border border-white/15
            rounded-md
            bg-black
            animate-in fade-in duration-300
            shadow-inner
          "
        >
          <ItemDisplayList initialItems={items} />
        </div>
      </main>
    </div>
  );
}

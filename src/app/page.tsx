import ItemDisplayList from "@/components/Item/ItemDisplayList";
import { LazyMap } from "@/components/Map/LazyMap";
import { getQueryClient } from "@/lib/create-query-client";
import { FETCH_ITEMS } from "@/lib/options";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// https://stackoverflow.com/questions/77978480/nextjs-with-react-leaflet-ssr-webpack-window-not-defined-icon-not-found
// https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading

// Prefetch items on server or initial client render


export const dynamic = "force-dynamic"; // Force server component to be dynamic
export default async function Home() {
  const queryClient = getQueryClient();
  await  queryClient.prefetchQuery(FETCH_ITEMS);

  return (
    <div className="md:h-[85vh] w-full flex flex-col justify-center items-center p-4">
      <main className="w-full p-12 h-full flex flex-row">
        <div className="flex flex-row gap-10 h-full w-full">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-8/10 h-full">
              <LazyMap />
            </div>
            <div className="w-2/10 bg-gray-100 rounded-lg h-full">
              <ItemDisplayList />
            </div>
          </HydrationBoundary>
        </div>
      </main>
      <div className="text-white text-center container h-full">
        Filter: The page into what it is
      </div>
    </div>
  );
}

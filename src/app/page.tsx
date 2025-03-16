"use client";
import ItemDisplayList from "@/components/ItemDisplayList";
import dynamic from "next/dynamic";

// https://stackoverflow.com/questions/77978480/nextjs-with-react-leaflet-ssr-webpack-window-not-defined-icon-not-found
const LazyMap = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <div className="md:h-[85vh] w-full flex flex-col justify-center items-center p-4">
      <main className="w-full p-12 h-full flex flex-row">
        <div className="flex flex-row gap-10 h-full w-full">
          <div className="w-8/10 h-full">
            <LazyMap />
          </div>
          <div className="w-2/10 bg-gray-100 rounded-lg h-full overflow-y-scroll">
            <ItemDisplayList />
          </div>
        </div>
      </main>
      <div className="text-white text-center container h-full">
        Filter: The page into what it is

      </div>
    </div>
  );
}

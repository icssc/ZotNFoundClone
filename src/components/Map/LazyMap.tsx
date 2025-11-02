"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Item as ItemType } from "@/db/schema";

interface LazyMapProps {
  initialItems: ItemType[];
}

const MapComponent = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-full w-full rounded-lg transition-all duration-300 bg-[#1f1f1f] opacity-95 animate-[pulse_5s_ease-in-out_infinite]" />
  ),
});

export const LazyMap = ({ initialItems }: LazyMapProps) => {
  return (
    <div className="w-full h-full transition-all duration-300 ease-out">
      <MapComponent initialItems={initialItems} />
    </div>
  );
};

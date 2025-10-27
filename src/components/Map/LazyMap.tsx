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
    <Skeleton className="h-full w-full rounded-lg transition-all duration-300 animate-pulse" />
  ),
});

export const LazyMap = ({ initialItems }: LazyMapProps) => {
  return (
    <div className="w-full h-full transition-all duration-300 ease-out">
      <MapComponent initialItems={initialItems} />
    </div>
  );
};

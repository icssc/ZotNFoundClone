"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Item as ItemType } from "@/db/schema";

interface LazyMapProps {
  initialItems: ItemType[];
}

const MapComponent = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <Skeleton className="h-full rounded-4xl" />,
});

export const LazyMap = ({ initialItems }: LazyMapProps) => {
  return <MapComponent initialItems={initialItems}  />;
};

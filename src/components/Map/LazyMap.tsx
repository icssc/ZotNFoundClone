"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Item as ItemType } from "@/db/schema";
import { User } from "better-auth";

interface LazyMapProps {
  initialItems: ItemType[];
  user: User | null;
}

const MapComponent = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <Skeleton className="h-full rounded-4xl" />,
});

export const LazyMap = ({ initialItems, user }: LazyMapProps) => {
  return <MapComponent initialItems={initialItems} user={user} />;
};

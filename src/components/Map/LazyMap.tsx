"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const LazyMap = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => <Skeleton className="h-full rounded-4xl" />,
});

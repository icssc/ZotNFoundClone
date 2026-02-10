"use client";

import dynamic from "next/dynamic";
import type { HomeItem } from "@/types/home";

const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
});

interface MapProps {
  initialItems: HomeItem[];
}

export default function Map({ initialItems }: MapProps) {
  return (
    <div className="relative w-full h-full bg-black animate-in fade-in duration-300 transition-all">
      <div className="absolute inset-0 border border-white pointer-events-none" />
      <MapContent initialItems={initialItems} />
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { HomeItem } from "@/types/home";
import { useEffect, useRef, useState } from "react";

interface LazyMapProps {
  initialItems: HomeItem[];
}

const MapComponent = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
  loading: () => (
    <Skeleton className="h-full w-full rounded-lg transition-all duration-300 bg-[#1f1f1f] opacity-95 animate-[pulse_5s_ease-in-out_infinite]" />
  ),
});

export const LazyMap = ({ initialItems }: LazyMapProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldLoad) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (shouldLoad) return;
    if (typeof window === "undefined") return;
    const schedule =
      "requestIdleCallback" in window
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 200);
    const id = schedule(() => setShouldLoad(true));
    return () => {
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as number);
      }
    };
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full transition-all duration-300 ease-out"
    >
      {shouldLoad ? (
        <MapComponent initialItems={initialItems} />
      ) : (
        <Skeleton className="h-full w-full rounded-lg transition-all duration-300 bg-[#1f1f1f] opacity-95 animate-[pulse_5s_ease-in-out_infinite]" />
      )}
    </div>
  );
};

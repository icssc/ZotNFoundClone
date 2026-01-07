"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSharedContext } from "@/components/ContextProvider";
import { trackSearch } from "@/lib/analytics";
import { useEffect, useRef } from "react";

export function SearchBar() {
  const { filter, setFilter } = useSharedContext();
  const previousFilterRef = useRef(filter);

  useEffect(() => {
    // Track when search is performed (debounced)
    if (filter && filter.length >= 2) {
      const timeoutId = setTimeout(() => {
        if (filter !== previousFilterRef.current) {
          trackSearch(filter);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }

    previousFilterRef.current = filter;
  }, [filter]);

  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </span>
      <Input
        className="pl-9 border-zinc-800"
        placeholder="Search items..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
}

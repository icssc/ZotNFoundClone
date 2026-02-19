"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSharedContext } from "@/components/ContextProvider";
import { trackSearch } from "@/lib/analytics";
import { useRef } from "react";

export function SearchBar() {
  const { filter, setFilter } = useSharedContext();
  const previousFilterRef = useRef(filter);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string) => {
    setFilter(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value && value.length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        if (value !== previousFilterRef.current) {
          trackSearch(value);
          previousFilterRef.current = value;
        }
      }, 500);
    } else {
      previousFilterRef.current = value;
    }
  };

  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </span>
      <Input
        className="pl-9 border-zinc-800"
        placeholder="Search items..."
        value={filter}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}

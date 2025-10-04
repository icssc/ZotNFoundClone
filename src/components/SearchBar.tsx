"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSharedContext } from "@/components/ContextProvider";

export function SearchBar() {
  const { filter, setFilter } = useSharedContext();
  const [keyword, setKeyword] = useState<string>(filter || "");

  useEffect(() => {
    setKeyword(filter || "");
  }, [filter]);

  useEffect(() => {
    const filterDelay: ReturnType<typeof setTimeout> = setTimeout(() => {
      setFilter(keyword.trim());
    }, 150);
    return () => clearTimeout(filterDelay);
  }, [keyword, setFilter]);

  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </span>
      <Input
        className="pl-9"
        placeholder="Search items..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </div>
  );
}

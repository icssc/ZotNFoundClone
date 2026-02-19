"use client";

import type { Item } from "@/db/schema";

interface DetailDescriptionProps {
  item: Item;
}

export function DetailDescription({ item }: DetailDescriptionProps) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300">
      <p className="font-medium text-white/60 text-xs uppercase tracking-wider mb-2">
        Description
      </p>
      <p className="text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-wrap">
        {item.description}
      </p>
    </div>
  );
}

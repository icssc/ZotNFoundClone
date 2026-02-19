"use client";

import { User, MapPin } from "lucide-react";
import type { Item } from "@/db/schema";
import { formatLocationDisplay } from "@/lib/types";

interface DetailInfoGridProps {
  item: Item;
}

export function DetailInfoGrid({ item }: DetailInfoGridProps) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
          <User className="h-5 w-5 text-white/80" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white/60 text-xs uppercase tracking-wider">
            Contact
          </p>
          <p className="text-sm sm:text-base text-white font-medium truncate">
            {item.email}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
          <MapPin className="h-5 w-5 text-white/80" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white/60 text-xs uppercase tracking-wider">
            Location
          </p>
          <p className="text-sm sm:text-base text-white font-medium wrap-break-word">
            {formatLocationDisplay(item.location)}
          </p>
        </div>
      </div>
    </div>
  );
}

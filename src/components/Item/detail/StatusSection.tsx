"use client";

import { Item } from "@/db/schema";
import { formatStatusLabel } from "@/lib/enums";

/**
 * StatusSection
 * Renders the date and semantic status for an item.
 *
 * Semantic status (Lost, Lost • Helped, Found, Found • Resolved) is derived
 * via formatStatusLabel (centralized in enums.ts).
 *
 * Props:
 *  - item: full item record
 *  - isLost: precomputed convenience boolean (to avoid recomputing in parent)
 */
export interface StatusSectionProps {
  item: Item;
  isLost: boolean;
  className?: string;
}

export function StatusSection({ item, isLost, className }: StatusSectionProps) {
  const statusLabel = formatStatusLabel(item);
  const dateLabel = item.date || item.itemDate || "Unknown date";

  return (
    <div
      className={
        className ??
        "flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md bg-white/1 hover:bg-white/5 transition-all duration-200"
      }
    >
      {/* Icon placeholder reserved for parent injection if desired */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm sm:text-base">
          Date &amp; Status
        </p>
        <p className="text-xs sm:text-sm text-gray-400">{dateLabel}</p>
        <p className="text-xs sm:text-sm text-gray-400">
          Status: {statusLabel}
        </p>
        {item.isResolved && !isLost && (
          <p className="text-xs sm:text-sm text-green-400 font-medium">
            ✓ Resolved
          </p>
        )}
        {item.isHelped && isLost && (
          <p className="text-xs sm:text-sm text-green-400 font-medium">
            ✓ Helped
          </p>
        )}
      </div>
    </div>
  );
}

export default StatusSection;

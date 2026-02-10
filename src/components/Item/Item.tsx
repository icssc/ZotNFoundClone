import { Button } from "@/components/ui/button";
import { isLostObject } from "@/lib/types";
import type { HomeItem } from "@/types/home";
import Image from "next/image";
import { trackItemViewed } from "@/lib/analytics";
import { getStatusClasses, formatStatusLabel } from "@/lib/enums";
import { formatDate } from "@/lib/utils";

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export default function Item({
  item,
  onClick,
  setOpen,
}: {
  item: HomeItem;
  onClick: () => void;
  setOpen: (open: boolean) => void;
}) {
  const islostObject = isLostObject(item);
  if (!item) {
    return null;
  }

  const { tintClass: statusTintClass, textClass: statusTextColor } =
    getStatusClasses(item);
  const statusLabel = formatStatusLabel(item);

  const handleClick = () => {
    trackItemViewed({
      itemId: String(item.id),
      itemType: item.type || "unknown",
      isLost: islostObject,
    });
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col overflow-hidden border border-white/5 bg-black/40 hover:bg-white/5 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 hover:scale-[1.02] cursor-pointer backdrop-blur-md"
    >
      {/* Image Section */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={
            item.image && isValidUrl(item.image)
              ? item.image
              : "/placeholder.jpg"
          }
          alt={item.name || "Item Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
          loading="lazy"
          preload={false}
          fetchPriority="low"
          priority={false}
          quality="75"
          className="transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
        <div
          className={`absolute -bottom-2 -left-2 w-28 h-28 rounded-tr-full opacity-70 mix-blend-screen pointer-events-none ${statusTintClass}`}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex flex-row justify-between items-end gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate text-lg">
                {item.name}
              </p>
              <p className={`text-sm truncate ${statusTextColor}`}>
                {statusLabel}
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-sm text-gray-300 truncate whitespace-nowrap">
                {formatDate(item.itemDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Action */}
      <div className="p-4">
        <p className="text-sm truncate text-gray-400 max-h-10 leading-relaxed">
          {item.description}
        </p>
        <div className="flex flex-row justify-end">
          <Button
            onClick={() => {
              setOpen(true);
            }}
            className="transition-all duration-200 bg-white/5 hover:bg-white/10 text-white"
          >
            {islostObject ? "I Found This" : "This Is Mine"}
          </Button>
        </div>
      </div>
    </div>
  );
}

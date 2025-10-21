"use client";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { isLostObject } from "@/lib/types";
import { Item } from "@/db/schema";
import Image from "next/image";

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function DetailedDialog({ item }: { item: Item }) {
  const islostObject = isLostObject(item);

  return (
    <DialogContent className="w-[calc(100%-2rem)] max-w-md bg-black/95 border-white/20 text-white p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 sm:h-12 sm:w-12 relative rounded-full overflow-hidden shrink-0">
            <Image
              src={
                item.image && isValidUrl(item.image)
                  ? item.image
                  : "/placeholder.jpg"
              }
              alt={item.name || "Item Image"}
              fill
              sizes="(max-width: 640px) 40px, 48px"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-white text-left truncate text-base sm:text-lg">
              {item.name}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-left text-xs sm:text-sm">
              {islostObject ? "Lost" : "Found"} item details
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-200">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm sm:text-base">
              Contact
            </p>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              {item.email}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-200">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm sm:text-base">
              Date & Status
            </p>
            <p className="text-xs sm:text-sm text-gray-400">{item.date}</p>
            <p className="text-xs sm:text-sm text-gray-400">
              Status: {islostObject ? "Lost" : "Found"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-md bg-white/5 hover:bg-white/10 transition-all duration-200">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm sm:text-base">
              Location
            </p>
            <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
              {item.location || "No location provided"}
            </p>
          </div>
        </div>

        <div className="pt-2 p-2 sm:p-3 rounded-md bg-white/5">
          <p className="font-medium text-white mb-2 text-sm sm:text-base">
            Description
          </p>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 sm:pt-3 border-t border-white/10">
        <Button
          variant="outline"
          className="bg-black hover:bg-white/10 border-white/30 text-white transition-all duration-200 hover:scale-105 text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
        >
          Contact
        </Button>
      </div>
    </DialogContent>
  );
}

export { DetailedDialog };

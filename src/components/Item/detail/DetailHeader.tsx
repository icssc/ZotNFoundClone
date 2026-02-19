"use client";

import Image from "next/image";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import type { Item } from "@/db/schema";

interface DetailHeaderProps {
  item: Item;
}

export function DetailHeader({ item }: DetailHeaderProps) {
  const imageSrc = z.url().safeParse(item.image).success
    ? item.image
    : "/dark_placeholder.jpg";

  return (
    <div className="relative w-full h-64 sm:h-80 shrink-0">
      <Image
        src={imageSrc}
        alt={item.name || "Item Image"}
        fill
        sizes="(max-width: 640px) 80vw, 448px"
        style={{ objectFit: "cover" }}
        className="bg-zinc-900"
        loading="eager"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/90 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-6 pt-12">
        <DialogHeader>
          <DialogTitle className="text-white text-left font-bold text-2xl sm:text-3xl tracking-tight drop-shadow-md animate-in-slide-up">
            {item.name}
          </DialogTitle>
        </DialogHeader>
      </div>
    </div>
  );
}

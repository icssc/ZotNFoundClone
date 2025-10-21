"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import { Item as ItemType } from "@/db/schema";

interface UrlDialogHandlerProps {
  items: ItemType[];
  children: React.ReactNode;
}

export function UrlDialogHandler({ items, children }: UrlDialogHandlerProps) {
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (itemId) {
      const item = items.find(i => i.id === parseInt(itemId));
      if (item) {
        setSelectedItem(item);
        setIsDialogOpen(true);
      }
    }
  }, [searchParams, items]);

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    // Remove the item parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('item');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <>
      {children}
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        {selectedItem && <DetailedDialog item={selectedItem} />}
      </Dialog>
    </>
  );
}

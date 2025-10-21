"use client";
import { Dialog } from "@/components/ui/dialog";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import { Item } from "@/db/schema";
import { useEffect, useState } from "react";

interface ItemDetailPageProps {
  item: Item;
}

export default function ItemDetailPage({ item }: ItemDetailPageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open the dialog when the page loads
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Navigate back to the main page
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DetailedDialog item={item} />
      </Dialog>
    </div>
  );
}

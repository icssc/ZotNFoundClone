"use client";

import { stringArrayToLatLng } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSharedContext } from "../ContextProvider";
import Item from "@/components/Item/Item";
import type { HomeItem } from "@/types/home";
import type { Item as FullItem } from "@/db/schema";
import type { LatLngExpression } from "leaflet";
import { filterItems } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import dynamic from "next/dynamic";
import { getItemDetails } from "@/server/actions/item/get-details/action";

const DetailedDialog = dynamic(
  () => import("@/components/Item/DetailedDialog").then((mod) => mod.DetailedDialog),
  { ssr: false }
);

interface ItemDisplayListProps {
  initialItems: HomeItem[];
}

function ItemDisplayList({ initialItems }: ItemDisplayListProps) {
  const { setSelectedLocation, filter } = useSharedContext();
  const searchParams = useSearchParams();
  const [detailItem, setDetailItem] = useState<FullItem | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const selectedItemId = useMemo(() => {
    const itemId = searchParams.get("item");
    if (!itemId) return null;
    const parsed = Number.parseInt(itemId, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  const selectedListItem = useMemo(
    () =>
      selectedItemId === null
        ? null
        : initialItems.find((item) => item.id === selectedItemId) || null,
    [initialItems, selectedItemId]
  );

  useEffect(() => {
    const activeItem = selectedListItem ?? detailItem;
    if (activeItem?.location) {
      const location: LatLngExpression = stringArrayToLatLng(
        activeItem.location
      );
      setSelectedLocation(location);
    }
  }, [detailItem, selectedListItem, setSelectedLocation]);

  useEffect(() => {
    if (selectedItemId === null) {
      setDetailItem(null);
      setDetailError(null);
      setIsDetailLoading(false);
      return;
    }
    if (detailItem?.id === selectedItemId) return;
    let isActive = true;
    setIsDetailLoading(true);
    setDetailError(null);
    void getItemDetails({ id: selectedItemId })
      .then((result) => {
        if (!isActive) return;
        if (result.success) {
          setDetailItem(result.data);
        } else {
          setDetailItem(null);
          setDetailError(result.error || "Unable to load item details.");
        }
      })
      .catch(() => {
        if (!isActive) return;
        setDetailItem(null);
        setDetailError("Unable to load item details.");
      })
      .finally(() => {
        if (isActive) {
          setIsDetailLoading(false);
        }
      });
    return () => {
      isActive = false;
    };
  }, [detailItem?.id, selectedItemId]);

  const handleItemClick = (item: HomeItem) => {
    if (item.location) {
      const location: LatLngExpression = stringArrayToLatLng(item.location);
      setSelectedLocation(location);
    }
  };

  const handleActionButtonClick = (item: HomeItem) => {
    // Update URL with item parameter to show the dialog
    const url = new URL(window.location.href);
    url.searchParams.set("item", item.id.toString());
    window.history.pushState({}, "", url.toString());
  };

  const filteredItems = filterItems(initialItems, filter);

  return (
    <>
      <div className="item-display-list flex h-full overflow-y-auto flex-col p-4 space-y-4 bg-black/80 backdrop-blur-xl border-r border-white/5 animate-in fade-in duration-500">
        {filteredItems.length > 0 ? (
          filteredItems.map((item: HomeItem, index: number) => (
            <div
              key={item.id ?? index}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Item
                item={item}
                onClick={() => handleItemClick(item)}
                setOpen={() => handleActionButtonClick(item)}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-4 rounded-full bg-white/5 mb-4">
              <SearchX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              No items found
            </h3>
            <p className="text-sm text-gray-400">
              Try adjusting your search to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={selectedItemId !== null}
        onOpenChange={(open) => {
          if (!open) {
            // Remove the item parameter from URL
            const url = new URL(window.location.href);
            url.searchParams.delete("item");
            window.history.replaceState({}, "", url.toString());
          }
        }}
      >
        {detailItem && <DetailedDialog item={detailItem} />}
        {!detailItem && selectedItemId !== null && (
          <DialogContent className="bg-black/60 border-white/10 text-white">
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <span>{isDetailLoading ? "Loading item..." : "Item unavailable."}</span>
              {detailError && <span className="text-red-400">{detailError}</span>}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

export default ItemDisplayList;

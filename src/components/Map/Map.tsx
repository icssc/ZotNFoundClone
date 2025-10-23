"use client";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { centerPosition, mapBounds } from "@/lib/constants";
import ObjectMarkers from "./Markers";
import { useSharedContext } from "@/components/ContextProvider";
import { Dialog } from "@/components/ui/dialog";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import { LatLngExpression } from "leaflet";
import { Button } from "@/components/ui/button";
import { AddLocationDialog } from "./AddLocationDialog";
import { PlusIcon } from "lucide-react";
import { Item as ItemType } from "@/db/schema";
import { useSearchParams } from "next/navigation";

interface MapProps {
  initialItems: ItemType[];
}

// https://github.com/allartk/leaflet.offline Caching the map tiles would be quite nice as well!

function MapController({
  selectedLocation,
}: {
  selectedLocation: LatLngExpression | null;
}) {
  const map = useMap();
  const bounds = mapBounds;
  const transparentColor = { color: "#000", opacity: 0, fillOpacity: 0 };

  const outerHandlers = useMemo(
    () => ({
      click() {
        map.fitBounds(bounds);
      },
    }),
    [bounds, map]
  );

  useEffect(() => {
    if (map) {
      map.setMaxBounds(bounds);
      if (selectedLocation) {
        map.flyTo(selectedLocation, 18);
      } else {
        map.fitBounds(bounds);
      }
    }
  }, [map, selectedLocation, bounds]);

  return (
    <Rectangle
      bounds={bounds}
      eventHandlers={outerHandlers}
      pathOptions={transparentColor}
    />
  );
}

function Map({ initialItems }: MapProps) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;
  const searchParams = useSearchParams();
  const { selectedLocation, filter } = useSharedContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const selectedObject = useMemo(() => {
    const itemId = searchParams.get("item");
    if (!itemId) return null;
    return initialItems.find((obj) => obj.id === parseInt(itemId)) || null;
  }, [searchParams, initialItems]);

  return (
    <MapContainer
      className="rounded-4xl z-0 h-full"
      center={centerPosition as [number, number]}
      zoom={17}
      minZoom={16}
      maxBounds={mapBounds}
      zoomControl={false}
      attributionControl={false}
      maxBoundsViscosity={1.0}
    >
      <TileLayer url={accessToken} />
      <MapController selectedLocation={selectedLocation} />
      {initialItems && initialItems.length > 0 && (
        <ObjectMarkers objects={initialItems} filter={filter} />
      )}
      <Dialog
        // !! makes undefined to a boolean
        open={!!selectedObject}
        onOpenChange={(open) => {
          if (!open) {
            // Remove the item parameter from URL
            const url = new URL(window.location.href);
            url.searchParams.delete("item");
            window.history.replaceState({}, "", url.toString());
          }
        }}
      >
        {selectedObject && <DetailedDialog item={selectedObject} />}
      </Dialog>
      <div>
        <Button
          className="absolute bottom-4 right-4 z-[999] bg-blue-500 text-white p-2 rounded-full w-12 h-12 text-xl"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusIcon className="h-6 w-6" />
        </Button>

        <AddLocationDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </MapContainer>
  );
}

export default Map;

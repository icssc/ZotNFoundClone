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
  const [selectedObjectId, setSelectedObjectId] = useState<number>();
  const { selectedLocation, filter } = useSharedContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const items = initialItems;
  const selectedObject = useMemo(() => {
    if (!selectedObjectId) return null;
    return items.find((obj) => obj.id === selectedObjectId) || null;
  }, [selectedObjectId, items]);

  return (
    <div className="relative w-full h-full animate-in fade-in duration-300">
      <div className="pointer-events-none absolute z-10 top-0 left-0 h-10 w-10">
        <div className="absolute top-0 left-0 h-8 w-[3px] bg-black" />
        <div className="absolute top-0 left-0 w-8 h-[3px] bg-black" />
      </div>
      <div className="pointer-events-none absolute top-0 right-0 h-10 w-10">
        <div className="absolute top-0 right-0 h-8 w-[3px] bg-black" />
        <div className="absolute top-0 right-0 w-8 h-[3px] bg-black" />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 h-10 w-10">
        <div className="absolute bottom-0 left-0 h-8 w-[3px] bg-black" />
        <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-black" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-10 w-10">
        <div className="absolute bottom-0 right-0 h-8 w-[3px] bg-black" />
        <div className="absolute bottom-0 right-0 w-8 h-[3px] bg-black" />
      </div>

      {/* Inner subtle border frame */}
      <div className="pointer-events-none absolute inset-0 border border-white/15 rounded-sm" />

      <MapContainer
        className="w-full h-full rounded-sm z-10 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
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
        {items && items.length > 0 && (
          <ObjectMarkers
            objects={items}
            setSelectedObjectId={setSelectedObjectId}
            filter={filter}
          />
        )}
        <TileLayer url={accessToken} />
        <MapController selectedLocation={selectedLocation} />
        {items && items.length > 0 && (
          <ObjectMarkers
            objects={items}
            setSelectedObjectId={setSelectedObjectId}
            filter={filter}
          />
        )}
        <Dialog
          open={!!selectedObjectId && !!selectedObject}
          onOpenChange={(open) => !open && setSelectedObjectId(undefined)}
        >
          {selectedObject && <DetailedDialog item={selectedObject} />}
        </Dialog>
        <div>
          <Button
            className="absolute bottom-4 right-4 z-1000 bg-black hover:bg-white/10 border border-white/30 text-white p-2 rounded-full w-12 h-12 text-xl transition-colors"
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
    </div>
  );
}

export default Map;

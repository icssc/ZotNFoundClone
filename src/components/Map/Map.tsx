"use client";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { centerPosition, mapBounds } from "@/lib/constants";
import ObjectMarkers from "./Markers";
import { useSharedContext } from "@/components/ContextProvider";
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
  const { selectedLocation, filter } = useSharedContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const items = initialItems;
  return (
    <div className="relative w-full h-full bg-black animate-in fade-in duration-300 transition-all">
      {/* White border frame with black spacing */}
      <div className="absolute inset-0 border border-white pointer-events-none" />

      {/* Inner content with padding to create black space between border and map */}
      <div className="relative w-full h-full p-1.5">
        {/* Corner accents */}
        <div className="pointer-events-none absolute z-10 -top-px -left-px h-10 w-10">
          <div className="absolute -top-px -left-px h-8 w-[3px] bg-white" />
          <div className="absolute -top-px -left-px w-8 h-[3px] bg-white" />
        </div>
        <div className="pointer-events-none absolute z-10 -top-px -right-px h-10 w-10">
          <div className="absolute -top-px -right-px h-8 w-[3px] bg-white" />
          <div className="absolute -top-px -right-px w-8 h-[3px] bg-white" />
        </div>
        <div className="pointer-events-none absolute z-10 -bottom-px -left-px h-10 w-10">
          <div className="absolute -bottom-px -left-px h-8 w-[3px] bg-white" />
          <div className="absolute -bottom-px -left-px w-8 h-[3px] bg-white" />
        </div>
        <div className="pointer-events-none absolute z-10 -bottom-px -right-px h-10 w-10">
          <div className="absolute -bottom-px -right-px h-8 w-[3px] bg-white" />
          <div className="absolute -bottom-px -right-px w-8 h-[3px] bg-white" />
        </div>

        <MapContainer
          className="w-full h-full z-0 shadow-2xl transition-all duration-300 border-black"
          center={centerPosition as [number, number]}
          zoom={17}
          minZoom={15} // was 16
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
              filter={filter}
            />
          )}
          <div>
            <Button
              className="absolute bottom-4 right-4 z-1000 bg-black hover:bg-white/10 border border-white/30 text-white p-2 rounded-full w-12 h-12 text-xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
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
    </div>
  );
}

export default Map;

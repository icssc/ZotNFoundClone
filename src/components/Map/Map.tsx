"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { centerPosition, mapBounds } from "@/lib/constants";
import ObjectMarkers from "./Markers";
import { useSharedContext } from "@/components/ContextProvider";
import { Dialog } from "@/components/ui/dialog";
import { DetailedDialog } from "@/components/Item/DetailedDialog";
import { LatLngExpression } from "leaflet";
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

  const selectedObject = useMemo(() => {
    if (!selectedObjectId) return null;
    return initialItems.find((obj) => obj.id === selectedObjectId) || null;
  }, [selectedObjectId, initialItems]);

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
        <ObjectMarkers
          objects={initialItems}
          setSelectedObjectId={setSelectedObjectId}
          filter={filter}
        />
      )}
      <Dialog
        // !! makes undefined to a boolean
        open={!!selectedObjectId && !!selectedObject}
        onOpenChange={(open) => !open && setSelectedObjectId(undefined)}
      >
        {selectedObject && <DetailedDialog item={selectedObject} />}
      </Dialog>
    </MapContainer>
  );
}

export default Map;

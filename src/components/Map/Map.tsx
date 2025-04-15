"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { centerPosition, mapBounds } from "@/lib/constants";
import { lostObjects, foundObjects } from "@/lib/fakeData";
import { mapObjectsToDisplayObjects, Object } from "@/lib/types";
import ObjectMarkers from "./Markers";
import { useMapContext } from "../ContextProvider";
import {
  Dialog,
} from "@/components/ui/dialog";
import { ItemDetailDialog } from "@/components/Item/DetailedDialog";

// https://github.com/allartk/leaflet.offline Caching the map tiles would be quite nice as well!

function MapController() {
  const map = useMap();
  const { selectedLocation } = useMapContext();
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

function Map() {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;
  const [selectedObjectId, setSelectedObjectId] = useState<string>();
  if (!accessToken) {
    throw new Error("Mapbox access token is required");
  }

  // Replace this with useQuery call or taking it from context provider if I implemented it
  const objects = useMemo(() => {
    const objects: Object[] = (lostObjects as Object[]).concat(foundObjects);
    return objects;
  }, []);

  const objectLocations = useMemo(() => {
    return mapObjectsToDisplayObjects(objects);
  }, [objects]);

  const selectedObject = useMemo(() => {
    if (!selectedObjectId) return null;
    return objects.find((obj) => obj.itemId === selectedObjectId) || null;
  }, [selectedObjectId, objects]);

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
      <MapController />
      <ObjectMarkers
        objectLocations={objectLocations}
        setSelectedObjectId={setSelectedObjectId}
      />
      <Dialog
        // !! makes undefined to a boolean
        open={!!selectedObjectId && !!selectedObject}
        onOpenChange={(open) => !open && setSelectedObjectId(undefined)}
      >
        {selectedObject && <ItemDetailDialog item={selectedObject} />}
      </Dialog>
    </MapContainer>
  );
}

export { Map as default };

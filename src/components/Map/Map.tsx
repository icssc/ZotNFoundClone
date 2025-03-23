"use client";
import React, { useEffect, useMemo } from "react";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { centerPosition, mapBounds } from "@/lib/constants";
import { lostObjects, foundObjects } from "@/lib/fakeData";
import { mapObjectsToDisplayObjects, Object } from "@/lib/types";
import ObjectMarkers from "./Markers";
import { useMapContext } from "../ContextProvider";

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
  if (!accessToken) {
    throw new Error("Mapbox access token is required");
  }

  // Replace this with useQuery call or taking it from context provider if I implemented it
  const objectLocations = useMemo(() => {
    const objects: Object[] = (lostObjects as Object[]).concat(foundObjects);
    return mapObjectsToDisplayObjects(objects);
  }, []);

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
      <ObjectMarkers objectLocations={objectLocations} />
    </MapContainer>
  );
}

export { Map as default };

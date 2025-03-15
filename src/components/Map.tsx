"use client";
import React, { useEffect, useMemo } from "react";
import { MapContainer, Rectangle, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { centerPosition, mapBounds } from "@/lib/constants";

function SetBoundsRectangles() {
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
    map.fitBounds(bounds);
  }, [bounds, map]);

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

  return (
    <MapContainer
      className="rounded-[30px] z-0"
      center={centerPosition as [number, number]}
      zoom={17}
      maxZoom={18}
      minZoom={16}
      maxBounds={mapBounds}
      zoomControl={false}
      attributionControl={false}
      maxBoundsViscosity={1.0}
      style={{ height: "70dvh" }}
    >
      <TileLayer url={accessToken} />
      <SetBoundsRectangles />
    </MapContainer>
  );
}

export default Map;

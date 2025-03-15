"use client";
import React, { useMemo } from "react";
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

  return (
    <>
      <Rectangle
        bounds={bounds}
        eventHandlers={outerHandlers}
        pathOptions={transparentColor}
      />
    </>
  );
}

function Map() {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;
  if (!accessToken) {
    throw new Error("Mapbox access token is required");
  }

  return (
    <div>
      <MapContainer
        className="map-container"
        center={centerPosition as [number, number]}
        zoom={17}
        minZoom={15}
        zoomControl={false}
        attributionControl={false}
        maxBounds={mapBounds}
        maxBoundsViscosity={1.0}
        style={{ height: "75vh" }}
      >
        <TileLayer url={accessToken} />
        <SetBoundsRectangles />
      </MapContainer>
    </div>
  );
}

export default Map;

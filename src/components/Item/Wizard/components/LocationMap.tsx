"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { Map as createMap, tileLayer, marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { LocationFormData } from "@/lib/types";
import { centerPosition, mapBounds } from "@/lib/constants";
import { iconsMap } from "@/lib/icons";

interface LocationMapProps {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export default function LocationMap({
  formData,
  updateField,
}: LocationMapProps) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new createMap(containerRef.current, {
      center: centerPosition as [number, number],
      zoom: 17,
      minZoom: 12,
      maxBounds: mapBounds,
      zoomControl: true,
      attributionControl: false,
      maxBoundsViscosity: 1.0,
    });
    mapRef.current = map;
    tileLayer(accessToken).addTo(map);
    map.fitBounds(mapBounds);
    map.on("click", (event) => {
      updateField("location", [event.latlng.lat, event.latlng.lng]);
    });
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [accessToken, updateField]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!formData.location) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      return;
    }
    const icon = formData.isLost ? iconsMap.others.true : iconsMap.others.false;
    if (!markerRef.current) {
      markerRef.current = marker(formData.location as [number, number], {
        icon,
        title: formData.name || "",
      }).addTo(map);
    } else {
      markerRef.current.setLatLng(formData.location as [number, number]);
      markerRef.current.setIcon(icon);
    }
  }, [formData.location, formData.isLost, formData.name]);

  return <div ref={containerRef} className="w-full h-full" />;
}

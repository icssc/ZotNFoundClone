"use client";
import { useEffect, useRef } from "react";
import L, {
  map as createMap,
  tileLayer,
  type Map as LeafletMap,
  type Marker as LeafletMarker,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { Label } from "@/components/ui/label";
import { LocationFormData } from "@/lib/types";
import { centerPosition, mapBounds } from "@/lib/constants";
import { iconsMap } from "@/lib/icons";

interface Step6Props {
  formData: LocationFormData;
  updateField: <K extends keyof LocationFormData>(
    field: K,
    value: LocationFormData[K]
  ) => void;
}

export function Step6LocationSelection({ formData, updateField }: Step6Props) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = createMap(containerRef.current, {
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
    map.on("click", (e) => {
      updateField("location", [e.latlng.lat, e.latlng.lng]);
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
      markerRef.current = L.marker(formData.location as [number, number], {
        icon,
        title: formData.name || "",
      }).addTo(map);
    } else {
      markerRef.current.setLatLng(formData.location as [number, number]);
      markerRef.current.setIcon(icon);
    }
  }, [formData.location, formData.isLost, formData.name]);

  return (
    <div className="space-y-2">
      <Label className="text-white">📍 Select the location on the map:</Label>
      <div className="md:h-[400px] h-[300px] md:w-[600px] w-full rounded-md overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />
      </div>
      <p className="text-sm text-gray-400">
        Click on the map to place a marker where the item was{" "}
        {formData.isLost ? "lost" : "found"}.
      </p>
    </div>
  );
}

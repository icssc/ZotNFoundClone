"use client";
import { useEffect, useRef, useState } from "react";
import {
  map as createMap,
  tileLayer,
  rectangle,
  type LatLngExpression,
  type Map as LeafletMap,
  type Rectangle as LeafletRectangle,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import { centerPosition, mapBounds } from "@/lib/constants";
import { useSharedContext } from "@/components/ContextProvider";
import { Button } from "@/components/ui/button";
import { AddItemDialog } from "./AddItemDialog";
import { SignInDialog } from "./SignInDialog";
import { PlusIcon } from "lucide-react";
import { Item as ItemType } from "@/db/schema";
import Markers from "./Markers";

interface MapProps {
  initialItems: ItemType[];
}

export default function Map({ initialItems }: MapProps) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;
  const { user, selectedLocation, filter } = useSharedContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  const mapRef = useRef<LeafletMap | null>(null);
  const boundsRectRef = useRef<LeafletRectangle | null>(null);
  const [isMapMounted, setIsMapMounted] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
      const el = document.getElementById("leaflet-map-root");
      if (!el) return;

      const map = createMap(el, {
        center: centerPosition as [number, number],
        zoom: 17,
        minZoom: 15,
        maxBounds: mapBounds,
        zoomControl: false,
        attributionControl: false,
        maxBoundsViscosity: 1.0,
      });

      mapRef.current = map;
      map.addEventListener("resize", () => {
        map.invalidateSize();
      });
      // Add base tile layer (Mapbox or other provider)
      tileLayer(accessToken).addTo(map);

      // Add an invisible rectangle to allow clicking anywhere to refit bounds
      const transparentStyle = { color: "#000", opacity: 0, fillOpacity: 0 };
      const rect = rectangle(mapBounds, transparentStyle);
      rect.on("click", () => {
        map.fitBounds(mapBounds);
      });
      rect.addTo(map);
      boundsRectRef.current = rect;

      // Fit bounds initially
      map.fitBounds(mapBounds);

      // Defer readiness flag to next frame to avoid synchronous render cascade
      requestAnimationFrame(() => setIsMapMounted(true)); // Set map as mounted
    }

    return () => {
      if (boundsRectRef.current) {
        boundsRectRef.current.remove();
        boundsRectRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setIsMapMounted(false); // Reset map mounted state
    };
  }, [accessToken]); // only re-run if tile URL changes

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (selectedLocation) {
      map.flyTo(selectedLocation as LatLngExpression, 18);
    } else {
      map.fitBounds(mapBounds);
    }
  }, [selectedLocation]);

  const items = initialItems;

  return (
    <div className="relative w-full h-full bg-black animate-in fade-in duration-300 transition-all">
      {/* White border frame */}
      <div className="absolute inset-0 border border-white pointer-events-none" />

      {/* Inner container with padding (creates spacing between border and map) */}
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

        {/* Leaflet mount point */}
        <div
          id="leaflet-map-root"
          className="w-full h-full z-0 shadow-2xl transition-all duration-300 border-black"
        />

        {/* Render markers when map is ready */}
        {isMapMounted && items.length > 0 && (
          <Markers objects={items} filter={filter} mapRef={mapRef} />
        )}

        {/* Floating add button */}
        <Button
          className="absolute bottom-4 right-4 z-1000 bg-black hover:bg-white/10 border border-white/30 text-white p-2 rounded-full w-12 h-12 text-xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
          onClick={() => {
            if (user) {
              setIsAddDialogOpen(true);
            } else {
              setIsSignInDialogOpen(true);
            }
          }}
        >
          <PlusIcon className="h-6 w-6" />
        </Button>

        <AddItemDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
        <SignInDialog
          open={isSignInDialogOpen}
          onOpenChange={setIsSignInDialogOpen}
        />
      </div>
    </div>
  );
}

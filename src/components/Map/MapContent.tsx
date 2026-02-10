"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map as createMap,
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
import dynamic from "next/dynamic";
import { PlusIcon } from "lucide-react";
import type { HomeItem } from "@/types/home";
import Markers from "./Markers";
import {
  trackAddItemDialogOpened,
  trackSignInDialogOpened,
} from "@/lib/analytics";

const ItemWizardDialog = dynamic(
  () => import("../Item/ItemWizardDialog").then((mod) => mod.ItemWizardDialog),
  { ssr: false }
);

const SignInDialog = dynamic(
  () => import("./SignInDialog").then((mod) => mod.SignInDialog),
  { ssr: false }
);

interface MapContentProps {
  initialItems: HomeItem[];
}

export default function MapContent({ initialItems }: MapContentProps) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_DARK_URL!;
  const { user, selectedLocation, filter } = useSharedContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const boundsRectRef = useRef<LeafletRectangle | null>(null);
  const [isMapMounted, setIsMapMounted] = useState(false);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const el = containerRef.current;
    const { width, height } = el.getBoundingClientRect();
    if (width === 0 || height === 0) {
      const timer = setTimeout(() => {
        setIsMapMounted(false);
      }, 10);
      return () => clearTimeout(timer);
    }

    const map = new createMap(el, {
      center: centerPosition as [number, number],
      zoom: 17,
      minZoom: 15,
      maxBounds: mapBounds,
      zoomControl: false,
      attributionControl: false,
      maxBoundsViscosity: 1.0,
    });

    mapRef.current = map;

    tileLayer(accessToken).addTo(map);

    const rect = rectangle(mapBounds, {
      color: "#000",
      opacity: 0,
      fillOpacity: 0,
    });
    rect.on("click", () => map.fitBounds(mapBounds));
    rect.addTo(map);
    boundsRectRef.current = rect;

    // Ensure proper sizing after Leaflet is ready
    map.whenReady(() => {
      map.invalidateSize(true);
      map.fitBounds(mapBounds);
      setIsMapMounted(true);
    });

    return () => {
      if (boundsRectRef.current) {
        boundsRectRef.current.remove();
        boundsRectRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setIsMapMounted(false);
    };
  }, [accessToken]);

  // Handle container resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !mapRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [isMapMounted]);

  // Handle selected location changes
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

      <div
        ref={containerRef}
        id="map"
        className="w-full h-full z-0 shadow-2xl transition-all duration-300 border-black"
      />

      {isMapMounted && items.length > 0 && (
        <Markers objects={items} filter={filter} mapRef={mapRef} />
      )}

      <Button
        className="absolute bottom-4 right-4 z-10 bg-black hover:bg-white/10 border border-white/30 text-white p-2 rounded-full w-12 h-12 text-xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
        onClick={() => {
          if (user) {
            trackAddItemDialogOpened();
            setIsAddDialogOpen(true);
          } else {
            trackSignInDialogOpened("add_item_button");
            setIsSignInDialogOpen(true);
          }
        }}
      >
        <PlusIcon className="h-6 w-6" />
      </Button>

      {isAddDialogOpen && (
        <ItemWizardDialog
          mode="create"
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      )}
      {isSignInDialogOpen && (
        <SignInDialog
          open={isSignInDialogOpen}
          onOpenChange={setIsSignInDialogOpen}
        />
      )}
    </div>
  );
}

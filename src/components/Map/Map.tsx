"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, {
  Map as MapboxMap,
  GeoJSONSource,
  PointLike,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { centerPosition, mapBounds } from "@/lib/constants";
import { useSharedContext } from "@/components/ContextProvider";
import { Button } from "@/components/ui/button";
import { AddItemDialog } from "./AddItemDialog";
import { SignInDialog } from "./SignInDialog";
import { PlusIcon } from "lucide-react";
import { Item as ItemType } from "@/db/schema";

/**
 * Map Props
 */
interface MapProps {
  initialItems: ItemType[];
}

/**
 * Transform app Item -> GeoJSON Feature
 */
function toFeature(item: ItemType): GeoJSON.Feature | null {
  const raw = item.location;
  if (!Array.isArray(raw) || raw.length < 2) return null;
  const lat = Number(raw[0]);
  const lng = Number(raw[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: {
      id: item.id,
      name: item.name,
      title: item.name,
      description: item.description,
    },
  };
}

/**
 * A safe style fallback ONLY if env style is missing (we maintain request to remove automatic swap).
 */
const FALLBACK_STYLE = "mapbox://styles/mapbox/streets-v12";

export default function Map({ initialItems }: MapProps) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const configuredStyle =
    process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL ||
    process.env.NEXT_PUBLIC_MAPBOX_DARK_URL ||
    "";

  // Use provided style if truthy, else fallback (does NOT override a failing style).
  const styleUrl = configuredStyle || FALLBACK_STYLE;

  mapboxgl.accessToken = accessToken;

  const { user, selectedLocation, setSelectedLocation } = useSharedContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  const mapRef = useRef<MapboxMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Memoized features to avoid recomputation on every render.
   */
  const geojsonData = useMemo<GeoJSON.FeatureCollection>(() => {
    const features = initialItems
      .map(toFeature)
      .filter((f): f is GeoJSON.Feature => !!f);
    return { type: "FeatureCollection", features };
  }, [initialItems]);

  /**
   * Initialize map once.
   */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [centerPosition[1], centerPosition[0]],
      zoom: 17,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Max bounds from Leaflet bounds
      try {
        const sw = mapBounds.getSouthWest();
        const ne = mapBounds.getNorthEast();
        map.setMaxBounds([
          [sw.lng, sw.lat],
          [ne.lng, ne.lat],
        ]);
      } catch {
        /* ignore */
      }

      add3DBuildings(map);
      addMarkerSourceAndLayers(map);
      updateMarkerSource(map, geojsonData);
      attachMarkerHandlers(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl]);

  /**
   * Update markers when items change.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (map.isStyleLoaded()) {
      updateMarkerSource(map, geojsonData);
    } else {
      map.once("load", () => updateMarkerSource(map, geojsonData));
    }
  }, [geojsonData]);

  /**
   * Fly to externally selected location.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (
      selectedLocation &&
      Array.isArray(selectedLocation) &&
      selectedLocation.length >= 2
    ) {
      const [lat, lng] = selectedLocation as any[];
      map.flyTo({ center: [lng, lat], zoom: 18, essential: true });
    } else {
      try {
        const sw = mapBounds.getSouthWest();
        const ne = mapBounds.getNorthEast();
        map.fitBounds([
          [sw.lng, sw.lat],
          [ne.lng, ne.lat],
        ]);
      } catch {
        /* ignore */
      }
    }
  }, [selectedLocation]);

  /**
   * Add 3D buildings layer.
   */
  const add3DBuildings = (map: MapboxMap) => {
    const layers = map.getStyle().layers || [];
    let labelLayerId: string | undefined;
    for (const layer of layers) {
      if (layer.type === "symbol" && (layer.layout as any)?.["text-field"]) {
        labelLayerId = layer.id;
        break;
      }
    }

    if (!map.getLayer("3d-buildings")) {
      map.addLayer(
        {
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#a0a0a0",
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "min_height"],
            "fill-extrusion-opacity": 0.8,
          },
        },
        labelLayerId
      );
    }
  };

  /**
   * Add marker source & layers if missing.
   */
  const addMarkerSourceAndLayers = (map: MapboxMap) => {
    if (!map.getSource("markers")) {
      map.addSource("markers", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterRadius: 50,
      });
    }

    if (!map.getLayer("clusters")) {
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "markers",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            5,
            "#f1f075",
            20,
            "#f28cb1",
          ],
          "circle-radius": ["step", ["get", "point_count"], 15, 5, 20, 20, 30],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#fff",
        },
      });
    }

    if (!map.getLayer("cluster-count")) {
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "markers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#000",
        },
      });
    }

    if (!map.getLayer("unclustered-point")) {
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "markers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 8,
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 2,
        },
      });
    }
  };

  /**
   * Efficiently update marker source.
   */
  const updateMarkerSource = (
    map: MapboxMap,
    data: GeoJSON.FeatureCollection
  ) => {
    const source = map.getSource("markers") as GeoJSONSource | undefined;
    if (!source) return;
    source.setData(data);
  };

  /**
   * Attach interaction handlers.
   */
  const attachMarkerHandlers = (map: MapboxMap) => {
    // Cluster click expand
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point as PointLike, {
        layers: ["clusters"],
      });
      if (!features.length) return;
      const rawClusterId = features[0].properties?.cluster_id;
      if (rawClusterId == null) return;
      const clusterId = Number(rawClusterId);
      if (Number.isNaN(clusterId)) return;
      const mSource = map.getSource("markers") as GeoJSONSource | undefined;
      if (!mSource) return;
      mSource.getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
        if (err || typeof zoom !== "number") return;
        const coords = (features[0].geometry as any).coordinates;
        map.easeTo({ center: coords, zoom });
      });
    });

    // Marker click
    map.on("click", "unclustered-point", (e) => {
      const features = map.queryRenderedFeatures(e.point as PointLike, {
        layers: ["unclustered-point"],
      });
      if (!features.length) return;
      const feat: any = features[0];
      const coords = feat.geometry.coordinates;
      const id =
        feat.properties?.id ?? feat.properties?.identifier ?? feat.id ?? null;

      // Fly
      map.flyTo({ center: coords, zoom: 18, essential: true });

      // Context location
      if (id !== null) {
        setSelectedLocation([coords[1], coords[0]]);
        // Update URL for dialog opening
        const url = new URL(window.location.href);
        url.searchParams.set("item", String(id));
        window.history.pushState({}, "", url.toString());
      }
    });

    // Cursor styling
    const pointerLayers = ["clusters", "unclustered-point"];
    pointerLayers.forEach((layer) => {
      map.on("mouseenter", layer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layer, () => {
        map.getCanvas().style.cursor = "";
      });
    });
  };

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

        {/* Map mount point */}
        <div
          id="leaflet-map-root"
          ref={containerRef}
          className="w-full h-full z-0 shadow-2xl transition-all duration-300 border-black"
        />

        {/* Add button */}
        <Button
          className="absolute bottom-4 right-4 z-10 bg-black hover:bg-white/10 border border-white/30 text-white p-2 rounded-full w-12 h-12 text-xl transition-all duration-300 hover:scale-110 hover:shadow-xl"
          onClick={() => {
            if (user) setIsAddDialogOpen(true);
            else setIsSignInDialogOpen(true);
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

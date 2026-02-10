"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { createClusterGroup, addMarkerToGroup } from "@/lib/cluster-loader";
import {
  marker,
  type LatLngExpression,
  type Map as LeafletMap,
  type LayerGroup,
} from "leaflet";
import type { HomeItem } from "@/types/home";
import { filterItems } from "@/lib/utils";
import { stringArrayToLatLng } from "@/lib/types";
import { iconsMap, createClusterCustomIcon } from "@/lib/icons";
import { trackMarkerClicked } from "@/lib/analytics";

interface ClusterMarkersProps {
  objects: HomeItem[];
  filter: string;
  mapRef: RefObject<LeafletMap | null>;
  onMarkerClick?: (item: HomeItem) => void;
}

export default function Markers({
  objects,
  filter,
  mapRef,
  onMarkerClick,
}: ClusterMarkersProps) {
  const groupRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (groupRef.current) {
      map.removeLayer(groupRef.current);
      groupRef.current = null;
    }

    const filtered = filterItems(objects, filter);
    if (filtered.length === 0) return;

    const clusterGroup = createClusterGroup({
      chunkedLoading: true,
      iconCreateFunction: createClusterCustomIcon,
    });

    filtered.forEach((item) => {
      const position = stringArrayToLatLng(item.location!) as LatLngExpression;
      const icon = item.isLost ? iconsMap.others.true : iconsMap.others.false;
      const mkr = marker(position, { icon, title: item.name ?? "" });
      mkr.on("click", () => {
        // Track marker click
        trackMarkerClicked({
          itemId: String(item.id),
          itemType: item.type || "unknown",
          isLost: item.isLost || false,
        });

        const url = new URL(window.location.href);
        url.searchParams.set("item", item.id.toString());
        window.history.pushState({}, "", url.toString());
        onMarkerClick?.(item);
      });
      addMarkerToGroup(clusterGroup, mkr);
    });

    clusterGroup.addTo(map);
    groupRef.current = clusterGroup;

    return () => {
      if (groupRef.current) {
        map.removeLayer(groupRef.current);
        groupRef.current = null;
      }
    };
  }, [objects, filter, mapRef, onMarkerClick]);

  return null;
}

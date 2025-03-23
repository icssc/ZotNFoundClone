"use client";
import { Marker } from "react-leaflet";
import { DisplayObjects } from "@/lib/types";
import { createClusterCustomIcon, iconsMap } from "@/lib/icons";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster-4-next";

function ObjectMarkers({
  objectLocations,
}: {
  objectLocations: DisplayObjects[];
}) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterCustomIcon}
    >
      {objectLocations.map((address, index) => (
        <Marker
          key={index}
          position={address.location}
          title={address.object_id}
          icon={
            address.type === "lost"
              ? iconsMap.others.true
              : iconsMap.others.false
          }
        />
      ))}
    </MarkerClusterGroup>
  );
}

export default ObjectMarkers;
